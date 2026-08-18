import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { createLocalUserAccount, getLocalAccountByEmail, touchLocalUser } from "./db";

const scrypt = promisify(scryptCallback);
const MIN_PASSWORD_LENGTH = 16;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashLocalPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyLocalPassword(password: string, encoded: string) {
  const [algorithm, salt, hash] = encoded.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function ensureBootstrapLocalAdmin() {
  const email = normalizeEmail(process.env.LOCAL_AUTH_BOOTSTRAP_EMAIL ?? "");
  const password = process.env.LOCAL_AUTH_BOOTSTRAP_PASSWORD ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error("As credenciais locais do administrador não estão configuradas corretamente");
  }
  const existing = await getLocalAccountByEmail(email);
  if (existing) return existing.user;
  return createLocalUserAccount({
    email,
    name: "Administrador Bessa Energia",
    passwordHash: await hashLocalPassword(password),
    role: "admin",
  });
}

export async function authenticateLocalUser(emailInput: string, password: string) {
  await ensureBootstrapLocalAdmin();
  const localAccount = await getLocalAccountByEmail(normalizeEmail(emailInput));
  if (!localAccount || localAccount.account.isActive !== 1) return null;
  if (!(await verifyLocalPassword(password, localAccount.account.passwordHash))) return null;
  await touchLocalUser(localAccount.user.id);
  return localAccount.user;
}
