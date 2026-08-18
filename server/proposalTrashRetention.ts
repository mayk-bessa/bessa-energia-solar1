export const PROPOSAL_TRASH_RETENTION_DAYS = 30;

export function getProposalTrashRetentionCutoff(now = new Date()): Date {
  return new Date(now.getTime() - PROPOSAL_TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}
