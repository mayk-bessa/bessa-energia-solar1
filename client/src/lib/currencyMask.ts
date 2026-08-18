const BRL_INPUT_FORMATTER = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Converte os dígitos digitados em reais; por exemplo, "123456" vira 1234,56. */
export function parseBrlCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

/** Exibe um valor decimal no padrão brasileiro, sem repetir o prefixo R$ do campo. */
export function formatBrlCurrencyInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "";
  return BRL_INPUT_FORMATTER.format(Math.round(value * 100) / 100);
}
