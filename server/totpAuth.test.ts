import { beforeEach, describe, expect, it } from "vitest";
import { Secret, TOTP } from "otpauth";
import { createTotpSetup, decryptTotpSecret, encryptTotpSecret, verifyTotpCode } from "./totpAuth";

describe("autenticação em duas etapas", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "chave-de-teste-com-tamanho-suficiente-para-proteger-totp";
  });

  it("gera uma configuração compatível com Google Authenticator e valida um código atual", () => {
    const setup = createTotpSetup("admin@bessaenergia.com.br");
    const code = TOTP.generate({ secret: Secret.fromBase32(setup.base32Secret), digits: 6, period: 30 });

    expect(setup.otpauthUrl).toContain("otpauth://totp/");
    expect(setup.otpauthUrl).toContain("Bessa%20Energia");
    expect(verifyTotpCode(setup.base32Secret, code)).toBe(true);
    expect(verifyTotpCode(setup.base32Secret, "000000")).toBe(false);
  });

  it("protege o segredo antes da persistência e permite recuperá-lo somente com a chave correta", () => {
    const encrypted = encryptTotpSecret("JBSWY3DPEHPK3PXP");

    expect(encrypted).not.toContain("JBSWY3DPEHPK3PXP");
    expect(decryptTotpSecret(encrypted)).toBe("JBSWY3DPEHPK3PXP");
  });
});
