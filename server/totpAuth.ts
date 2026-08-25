import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { Secret, TOTP } from "otpauth";

const ISSUER = "Bessa Energia";

function getEncryptionKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("A chave de sessão não está configurada para proteger a autenticação em duas etapas");
  return createHash("sha256").update(secret).digest();
}

export function encryptTotpSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptTotpSecret(value: string) {
  const [ivEncoded, tagEncoded, encryptedEncoded] = value.split(".");
  if (!ivEncoded || !tagEncoded || !encryptedEncoded) throw new Error("Configuração de autenticação em duas etapas inválida");
  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivEncoded, "base64url"));
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedEncoded, "base64url")), decipher.final()]).toString("utf8");
}

export function createTotpSetup(label: string) {
  const secret = new Secret({ size: 20 });
  const totp = new TOTP({ issuer: ISSUER, label, secret, digits: 6, period: 30 });
  return { base32Secret: secret.base32, otpauthUrl: totp.toString() };
}

export function verifyTotpCode(base32Secret: string, code: string) {
  const sanitized = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(sanitized)) return false;
  return TOTP.validate({ token: sanitized, secret: Secret.fromBase32(base32Secret), digits: 6, period: 30, window: 1 }) !== null;
}
