import { describe, expect, it } from "vitest";
import { getConfirmedReviewId } from "./db";

describe("confirmação de envio de avaliações", () => {
  it("aceita apenas uma resposta do banco com identificador válido", () => {
    expect(getConfirmedReviewId({ insertId: 42 })).toBe(42);
    expect(getConfirmedReviewId([{ insertId: 43 }])).toBe(43);
  });

  it("rejeita resposta sem identificador para não exibir falso sucesso", () => {
    expect(() => getConfirmedReviewId({ insertId: 0 })).toThrow("não confirmou o salvamento");
    expect(() => getConfirmedReviewId({})).toThrow("não confirmou o salvamento");
  });
});
