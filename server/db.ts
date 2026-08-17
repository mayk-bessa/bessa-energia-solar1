import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, files, InsertFile, budgetRequests, InsertBudgetRequest, BudgetRequest, technicalVisits, InsertTechnicalVisit, reviews, InsertReview, chargingProposals, InsertChargingProposal, ChargingProposal } from "../drizzle/schema";
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
  if (!db) return undefined;
  const result = await db.insert(reviews).values(review);
  return { id: (result as any).insertId || (result as any)[0]?.id };
}

export async function getApprovedReviews() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.status, "approved")).orderBy(desc(reviews.createdAt));
}

export async function getPendingReviews() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.status, "pending")).orderBy(desc(reviews.createdAt));
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
  return { id: (result as any).insertId || (result as any)[0]?.id };
}

export async function getChargingProposals(filters: { sellerId?: number; limit?: number } = {}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(chargingProposals).orderBy(desc(chargingProposals.createdAt));
  if (filters.sellerId) {
    query = query.where(eq(chargingProposals.sellerId, filters.sellerId)) as any;
  }
  if (filters.limit) {
    query = query.limit(filters.limit) as any;
  }
  return await query;
}

export async function getChargingProposalById(id: number): Promise<ChargingProposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chargingProposals).where(eq(chargingProposals.id, id)).limit(1);
  return result[0];
}

export async function markChargingProposalAsSent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar a proposta");
  return await db.update(chargingProposals).set({ status: "sent", sentAt: new Date() }).where(eq(chargingProposals.id, id));
}

export async function getUsersForRoleManagement() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(id: number, role: "user" | "seller" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar o perfil");
  return await db.update(users).set({ role }).where(eq(users.id, id));
}
