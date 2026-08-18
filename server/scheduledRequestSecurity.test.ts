import { describe, expect, it } from "vitest";
import { isLoopbackAddress } from "./scheduledRequestSecurity";

describe("segurança de acionamentos agendados", () => {
  it("reconhece somente endereços de loopback como acionamentos locais confiáveis", () => {
    expect(isLoopbackAddress("127.0.0.1")).toBe(true);
    expect(isLoopbackAddress("::1")).toBe(true);
    expect(isLoopbackAddress("::ffff:127.0.0.1")).toBe(true);
    expect(isLoopbackAddress("143.95.208.202")).toBe(false);
    expect(isLoopbackAddress(undefined)).toBe(false);
  });
});
