import { eq, asc, desc, and, gte, lte, lt, like, or, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, files, InsertFile, budgetRequests, InsertBudgetRequest, BudgetRequest, technicalVisits, InsertTechnicalVisit, reviews, InsertReview, chargingProposals, InsertChargingProposal, ChargingProposal, localAccounts, maintenanceJobs, proposalDeletionAudits, proposalGoals, type ProposalDeletionAudit, type ProposalGoal } from "../drizzle/schema";
import { isNull } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getLocalAccountByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const openId = `local:${email.trim().toLowerCase()}`;
  const result = await db
    .select({ user: users, account: localAccounts })
    .from(users)
    .innerJoin(localAccounts, eq(localAccounts.userId, users.id))
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function createLocalUserAccount(input: {
  email: string;
  name: string;
  passwordHash: string;
  role: "seller" | "admin";
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para criar o acesso local");
  const email = input.email.trim().toLowerCase();
  const openId = `local:${email}`;

  await db.insert(users).values({
    openId,
    email,
    name: input.name.trim(),
    loginMethod: "local",
    role: input.role,
    lastSignedIn: new Date(),
  }).onDuplicateKeyUpdate({
    set: { email, name: input.name.trim(), loginMethod: "local", role: input.role, lastSignedIn: new Date() },
  });

  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Não foi possível criar o usuário local");
  await db.insert(localAccounts).values({ userId: user.id, passwordHash: input.passwordHash, isActive: 1 })
    .onDuplicateKeyUpdate({ set: { passwordHash: input.passwordHash, isActive: 1 } });
  return user;
}

export async function touchLocalUser(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function saveFileMetadata(file: InsertFile) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save file: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(files).values(file);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save file metadata:", error);
    throw error;
  }
}

export async function getUserFiles(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get files: database not available");
    return [];
  }

  try {
    const result = await db.select().from(files).where(eq(files.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user files:", error);
    return [];
  }
}

// Budget requests functions
export async function createBudgetRequest(request: InsertBudgetRequest) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create budget request: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(budgetRequests).values(request);
    // Get the inserted ID from the result
    const insertedId = (result as any).insertId || (result as any)[0]?.id;
    return { id: insertedId };
  } catch (error) {
    console.error("[Database] Failed to create budget request:", error);
    throw error;
  }
}

export async function getBudgetRequests(filters?: {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get budget requests: database not available");
    return [];
  }

  try {
    const conditions: any[] = [];

    if (filters?.status) {
      conditions.push(eq(budgetRequests.status, filters.status as any));
    }
    if (filters?.startDate) {
      conditions.push(gte(budgetRequests.createdAt, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(budgetRequests.createdAt, filters.endDate));
    }

    let query = db.select().from(budgetRequests).orderBy(desc(budgetRequests.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  } catch (error) {
    console.error("[Database] Failed to get budget requests:", error);
    return [];
  }
}

export async function getBudgetRequestById(id: number): Promise<BudgetRequest | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get budget request: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(budgetRequests).where(eq(budgetRequests.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get budget request:", error);
    return undefined;
  }
}

export async function updateBudgetRequest(id: number, updates: Partial<InsertBudgetRequest>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update budget request: database not available");
    return undefined;
  }

  try {
    const result = await db.update(budgetRequests).set(updates).where(eq(budgetRequests.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update budget request:", error);
    throw error;
  }
}

export async function createTechnicalVisit(visit: InsertTechnicalVisit) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create technical visit: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(technicalVisits).values(visit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create technical visit:", error);
    throw error;
  }
}

export async function getTechnicalVisitsByBudgetId(budgetRequestId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get technical visits: database not available");
    return [];
  }

  try {
    const result = await db.select().from(technicalVisits).where(eq(technicalVisits.budgetRequestId, budgetRequestId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get technical visits:", error);
    return [];
  }
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) {
    throw new Error("Banco de dados indisponível para registrar a avaliação");
  }
  const result = await db.insert(reviews).values(review);
  return { id: getConfirmedReviewId(result) };
}

export function getConfirmedReviewId(result: unknown): number {
  const id = extractInsertId(result);
  if (!id) throw new Error("O banco de dados não confirmou o salvamento da avaliação");
  return id;
}

export async function getApprovedReviews() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.status, "approved")).orderBy(desc(reviews.createdAt));
}

export type PendingReviewFilters = {
  search?: string;
  sort?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
};

export async function getPendingReviews(filters: PendingReviewFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(reviews.status, "pending")];
  const search = filters.search?.trim();
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(
      like(reviews.name, pattern),
      like(reviews.city, pattern),
      like(reviews.comment, pattern),
      like(reviews.projectType, pattern),
    )!);
  }
  const order = filters.sort === "oldest" ? asc(reviews.createdAt)
    : filters.sort === "highest_rating" ? desc(reviews.rating)
    : filters.sort === "lowest_rating" ? asc(reviews.rating)
    : desc(reviews.createdAt);
  return await db.select().from(reviews).where(and(...conditions)).orderBy(order, desc(reviews.createdAt));
}

export async function updateReviewStatus(id: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(reviews).set({ status }).where(eq(reviews.id, id));
}

export async function createChargingProposal(proposal: InsertChargingProposal) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para salvar a proposta");

  const result = await db.insert(chargingProposals).values(proposal);
  const id = extractInsertId(result);
  if (!id) throw new Error("O banco de dados não retornou o identificador da proposta salva");
  return { id };
}

export function extractInsertId(result: unknown): number | undefined {
  const values = Array.isArray(result) ? [result[0], result] : [result];
  for (const value of values) {
    const candidate = (value as { insertId?: unknown } | undefined)?.insertId;
    const id = typeof candidate === "bigint" ? Number(candidate) : Number(candidate);
    if (Number.isSafeInteger(id) && id > 0) return id;
  }
  return undefined;
}

export async function getChargingProposals(filters: { sellerId?: number; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];

  let condition = isNull(chargingProposals.deletedAt);
  if (filters.sellerId) condition = and(condition, eq(chargingProposals.sellerId, filters.sellerId))!;
  let query = db.select().from(chargingProposals).where(condition).orderBy(desc(chargingProposals.createdAt));
  if (filters.limit) {
    query = query.limit(filters.limit) as any;
  }
  return await query;
}

export async function getSentChargingProposalHistory(filters: { sellerId?: number; search?: string; status?: "pending" | "approved" | "rejected"; startDate?: Date; endDate?: Date; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];

  let condition = and(isNotNull(chargingProposals.sentAt), isNull(chargingProposals.deletedAt))!;
  if (filters.sellerId) condition = and(condition, eq(chargingProposals.sellerId, filters.sellerId))!;
  if (filters.status) condition = and(condition, eq(chargingProposals.status, filters.status))!;
  if (filters.startDate) condition = and(condition, gte(chargingProposals.sentAt, filters.startDate))!;
  if (filters.endDate) condition = and(condition, lt(chargingProposals.sentAt, filters.endDate))!;
  const search = filters.search?.trim();
  if (search) {
    const term = `%${search}%`;
    condition = and(condition, or(
      like(chargingProposals.clientName, term),
      like(chargingProposals.clientEmail, term),
      like(chargingProposals.sellerName, term),
    ))!;
  }
  let query = db.select().from(chargingProposals).where(condition).orderBy(desc(chargingProposals.sentAt));
  if (filters.limit) query = query.limit(filters.limit) as any;
  return await query;
}

export type MonthlyProposalMetrics = {
  month: string;
  totalProposals: number;
  sentProposals: number;
  pendingProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
  totalCents: number;
  sentTotalCents: number;
  bySeller: Array<{
    sellerId: number;
    sellerName: string;
    totalProposals: number;
    sentProposals: number;
    totalCents: number;
  }>;
};

export function buildMonthlyProposalMetrics(
  month: string,
  proposals: Array<Pick<ChargingProposal, "sellerId" | "sellerName" | "totalCents" | "sentAt" | "status">>,
): MonthlyProposalMetrics {
  const bySeller = new Map<number, MonthlyProposalMetrics["bySeller"][number]>();
  const initial: MonthlyProposalMetrics = {
    month,
    totalProposals: proposals.length,
    sentProposals: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
    totalCents: 0,
    sentTotalCents: 0,
    bySeller: [],
  };
  for (const proposal of proposals) {
    initial.totalCents += proposal.totalCents;
    if (proposal.sentAt) {
      initial.sentProposals += 1;
      initial.sentTotalCents += proposal.totalCents;
    }
    if (proposal.status === "approved") initial.approvedProposals += 1;
    else if (proposal.status === "rejected") initial.rejectedProposals += 1;
    else initial.pendingProposals += 1;

    const seller = bySeller.get(proposal.sellerId) ?? {
      sellerId: proposal.sellerId,
      sellerName: proposal.sellerName,
      totalProposals: 0,
      sentProposals: 0,
      totalCents: 0,
    };
    seller.totalProposals += 1;
    seller.totalCents += proposal.totalCents;
    if (proposal.sentAt) seller.sentProposals += 1;
    bySeller.set(proposal.sellerId, seller);
  }
  initial.bySeller = Array.from(bySeller.values()).sort((a, b) => b.totalProposals - a.totalProposals || a.sellerName.localeCompare(b.sellerName));
  return initial;
}

export async function getMonthlyProposalMetrics(filters: { month: string; sellerId?: number }) {
  const db = await getDb();
  if (!db) return buildMonthlyProposalMetrics(filters.month, []);
  const [year, month] = filters.month.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  let condition = and(gte(chargingProposals.createdAt, start), lt(chargingProposals.createdAt, end), isNull(chargingProposals.deletedAt))!;
  if (filters.sellerId) condition = and(condition, eq(chargingProposals.sellerId, filters.sellerId))!;
  const proposals = await db.select({
    sellerId: chargingProposals.sellerId,
    sellerName: chargingProposals.sellerName,
    totalCents: chargingProposals.totalCents,
    sentAt: chargingProposals.sentAt,
    status: chargingProposals.status,
  }).from(chargingProposals).where(condition);
  return buildMonthlyProposalMetrics(filters.month, proposals);
}

export async function getChargingProposalById(id: number): Promise<ChargingProposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chargingProposals).where(eq(chargingProposals.id, id)).limit(1);
  return result[0];
}

export async function getChargingProposalBySignatureToken(signatureToken: string): Promise<ChargingProposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  return (await db.select().from(chargingProposals).where(and(eq(chargingProposals.signatureToken, signatureToken), isNull(chargingProposals.deletedAt))).limit(1))[0];
}

export async function signChargingProposal(input: { id: number; name: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para registrar o aceite");
  const signedAt = new Date();
  await db.update(chargingProposals).set({ status: "approved", signedAt, signedByName: input.name.trim(), signedByEmail: input.email.trim().toLowerCase() }).where(eq(chargingProposals.id, input.id));
  return signedAt;
}

export async function getMaintenanceJobByTaskUid(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para executar a manutenção agendada");
  return (await db.select().from(maintenanceJobs).where(eq(maintenanceJobs.scheduleCronTaskUid, taskUid)).limit(1))[0];
}

export async function saveMaintenanceJobTaskUid(input: { jobKey: string; taskUid: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para configurar a manutenção agendada");
  await db.insert(maintenanceJobs).values({ jobKey: input.jobKey, scheduleCronTaskUid: input.taskUid }).onDuplicateKeyUpdate({
    set: { scheduleCronTaskUid: input.taskUid, updatedAt: new Date() },
  });
}

export async function markChargingProposalAsSent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar a proposta");
  return await db.update(chargingProposals).set({ sentAt: new Date() }).where(eq(chargingProposals.id, id));
}

export async function updateChargingProposalStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar a proposta");
  return await db.update(chargingProposals).set({ status }).where(eq(chargingProposals.id, id));
}

export async function deleteChargingProposal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para excluir a proposta");
  return await db.delete(chargingProposals).where(eq(chargingProposals.id, id));
}

export async function moveChargingProposalToTrash(input: { proposal: ChargingProposal; deletedBy: number; deletedByName: string; reason?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para mover a proposta para a lixeira");
  const deletedAt = new Date();
  await db.update(chargingProposals).set({ deletedAt, deletedBy: input.deletedBy, deletionReason: input.reason?.trim() || null }).where(eq(chargingProposals.id, input.proposal.id));
  await db.insert(proposalDeletionAudits).values({ proposalId: input.proposal.id, clientName: input.proposal.clientName, sellerId: input.proposal.sellerId, deletedBy: input.deletedBy, deletedByName: input.deletedByName, reason: input.reason?.trim() || null, deletedAt });
}

export async function getTrashedChargingProposals(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(chargingProposals).where(isNotNull(chargingProposals.deletedAt)).orderBy(desc(chargingProposals.deletedAt)).limit(limit);
}

export async function restoreChargingProposal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para restaurar a proposta");
  return await db.update(chargingProposals).set({ deletedAt: null, deletedBy: null, deletionReason: null }).where(eq(chargingProposals.id, id));
}

export async function purgeChargingProposalsDeletedBefore(before: Date) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para limpar a lixeira");
  return await db.delete(chargingProposals).where(and(isNotNull(chargingProposals.deletedAt), lt(chargingProposals.deletedAt, before))!);
}

export async function getProposalDeletionAudits(limit = 100): Promise<ProposalDeletionAudit[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(proposalDeletionAudits).orderBy(desc(proposalDeletionAudits.deletedAt)).limit(limit);
}

export async function getProposalGoal(sellerId: number, month: string): Promise<ProposalGoal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  return (await db.select().from(proposalGoals).where(and(eq(proposalGoals.sellerId, sellerId), eq(proposalGoals.month, month))).limit(1))[0];
}

export async function upsertProposalGoal(input: { sellerId: number; month: string; targetProposals: number; targetCents: number }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para configurar a meta");
  await db.insert(proposalGoals).values(input).onDuplicateKeyUpdate({ set: { targetProposals: input.targetProposals, targetCents: input.targetCents } });
  return await getProposalGoal(input.sellerId, input.month);
}

export async function getUsersForRoleManagement() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    loginMethod: users.loginMethod,
    createdAt: users.createdAt,
    isLocalAccountActive: localAccounts.isActive,
  }).from(users).leftJoin(localAccounts, eq(localAccounts.userId, users.id)).orderBy(desc(users.createdAt));
}

export async function updateUserRole(id: number, role: "user" | "seller" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar o perfil");
  return await db.update(users).set({ role }).where(eq(users.id, id));
}

async function getSellerForManagement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para gerenciar o vendedor");
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const user = result[0];
  if (!user || user.role !== "seller" || user.loginMethod !== "local") {
    throw new Error("Apenas contas locais de vendedores podem ser gerenciadas nesta área");
  }
  return { db, user };
}

export async function updateLocalSellerAccount(input: {
  id: number;
  name: string;
  email: string;
  passwordHash?: string;
}) {
  const { db } = await getSellerForManagement(input.id);
  const email = input.email.trim().toLowerCase();
  const existing = await getLocalAccountByEmail(email);
  if (existing && existing.user.id !== input.id) {
    throw new Error("Já existe uma conta local cadastrada com este e-mail");
  }
  await db.update(users).set({
    name: input.name.trim(),
    email,
    openId: `local:${email}`,
    lastSignedIn: new Date(),
  }).where(eq(users.id, input.id));
  if (input.passwordHash) {
    await db.update(localAccounts).set({ passwordHash: input.passwordHash }).where(eq(localAccounts.userId, input.id));
  }
}

export async function setLocalSellerAccountActive(id: number, isActive: boolean) {
  const { db } = await getSellerForManagement(id);
  await db.update(localAccounts).set({ isActive: isActive ? 1 : 0 }).where(eq(localAccounts.userId, id));
}

export async function deleteLocalSellerAccount(id: number) {
  const { db } = await getSellerForManagement(id);
  const [proposal] = await db.select({ id: chargingProposals.id }).from(chargingProposals).where(eq(chargingProposals.sellerId, id)).limit(1);
  const [file] = await db.select({ id: files.id }).from(files).where(eq(files.userId, id)).limit(1);
  if (proposal || file) {
    throw new Error("Esta conta possui propostas ou arquivos associados. Desative-a para preservar o histórico comercial.");
  }
  await db.delete(localAccounts).where(eq(localAccounts.userId, id));
  await db.delete(users).where(eq(users.id, id));
}
