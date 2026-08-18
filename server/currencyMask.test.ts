import { describe, expect, it } from "vitest";
import { formatBrlCurrencyInput, parseBrlCurrencyInput } from "../client/src/lib/currencyMask";

describe("máscara de valor unitário em reais", () => {
  it("converte dígitos digitados para reais usando centavos", () => {
    expect(parseBrlCurrencyInput("1")).toBe(0.01);
    expect(parseBrlCurrencyInput("123456")).toBe(1234.56);
    expect(parseBrlCurrencyInput("1.234,56")).toBe(1234.56);
  });

  it("exibe valor monetário brasileiro sem duplicar o prefixo R$", () => {
    expect(formatBrlCurrencyInput(1234.56)).toBe("1.234,56");
    expect(formatBrlCurrencyInput(0)).toBe("");
  });
});
