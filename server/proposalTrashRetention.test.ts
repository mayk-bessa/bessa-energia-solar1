import { describe, expect, it } from "vitest";
import { getProposalTrashRetentionCutoff, PROPOSAL_TRASH_RETENTION_DAYS } from "./proposalTrashRetention";

describe("retenção da lixeira de propostas", () => {
  it("calcula o corte de remoção definitiva após 30 dias completos", () => {
    const now = new Date("2026-08-18T12:00:00.000Z");
    expect(PROPOSAL_TRASH_RETENTION_DAYS).toBe(30);
    expect(getProposalTrashRetentionCutoff(now).toISOString()).toBe("2026-07-19T12:00:00.000Z");
  });
});
