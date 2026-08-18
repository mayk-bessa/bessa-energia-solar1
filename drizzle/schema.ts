import { int, mysqlEnum, mysqlTable, text, timestamp, unique, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "seller", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Credenciais locais para o painel comercial hospedado fora do OAuth Manus.
 * A senha é armazenada exclusivamente como hash derivado e nunca em texto puro.
 */
export const localAccounts = mysqlTable("localAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LocalAccount = typeof localAccounts.$inferSelect;
export type InsertLocalAccount = typeof localAccounts.$inferInsert;

/**
 * Files table for storing file metadata and S3 references
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * Budget requests table for storing client budget requests
 */
export const budgetRequests = mysqlTable("budgetRequests", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["new", "contacted", "proposal_sent", "closed", "rejected"]).default("new").notNull(),
  estimatedMonthlySpend: int("estimatedMonthlySpend"),
  notes: text("notes"),
  source: varchar("source", { length: 50 }).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BudgetRequest = typeof budgetRequests.$inferSelect;
export type InsertBudgetRequest = typeof budgetRequests.$inferInsert;

/**
 * Technical visits table for scheduling visits
 */
export const technicalVisits = mysqlTable("technicalVisits", {
  id: int("id").autoincrement().primaryKey(),
  budgetRequestId: int("budgetRequestId").notNull().references(() => budgetRequests.id),
  scheduledDate: timestamp("scheduledDate").notNull(),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "rescheduled"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechnicalVisit = typeof technicalVisits.$inferSelect;
export type InsertTechnicalVisit = typeof technicalVisits.$inferInsert;

/**
 * Public review submissions. Only approved records are shown on the website.
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  projectType: varchar("projectType", { length: 120 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Propostas de estação de recarga elaboradas por vendedores autorizados.
 * Os componentes são serializados em JSON para preservar o escopo comercial calculado.
 */
export const chargingProposals = mysqlTable("chargingProposals", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull().references(() => users.id),
  sellerName: varchar("sellerName", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 20 }),
  componentsJson: text("componentsJson").notNull(),
  totalCents: int("totalCents").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  projectType: mysqlEnum("projectType", ["solar", "ev_charging", "hybrid"]).default("ev_charging").notNull(),
  coverArt: varchar("coverArt", { length: 64 }).default("solar-home-vehicle").notNull(),
  validUntil: timestamp("validUntil"),
  signatureToken: varchar("signatureToken", { length: 96 }).unique(),
  signedAt: timestamp("signedAt"),
  signedByName: varchar("signedByName", { length: 255 }),
  signedByEmail: varchar("signedByEmail", { length: 320 }),
  sentAt: timestamp("sentAt"),
  deletedAt: timestamp("deletedAt"),
  deletedBy: int("deletedBy").references(() => users.id),
  deletionReason: varchar("deletionReason", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChargingProposal = typeof chargingProposals.$inferSelect;
export type InsertChargingProposal = typeof chargingProposals.$inferInsert;

/** Metas mensais configuradas por vendedor para o acompanhamento comercial. */
export const proposalGoals = mysqlTable("proposalGoals", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull().references(() => users.id),
  month: varchar("month", { length: 7 }).notNull(),
  targetProposals: int("targetProposals").default(0).notNull(),
  targetCents: int("targetCents").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [unique("proposalGoals_seller_month_unique").on(table.sellerId, table.month)]);

export type ProposalGoal = typeof proposalGoals.$inferSelect;
export type InsertProposalGoal = typeof proposalGoals.$inferInsert;

/** Registro imutável de exclusões administrativas para auditoria comercial. */
export const proposalDeletionAudits = mysqlTable("proposalDeletionAudits", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  sellerId: int("sellerId").notNull(),
  deletedBy: int("deletedBy").notNull(),
  deletedByName: varchar("deletedByName", { length: 255 }).notNull(),
  reason: varchar("reason", { length: 500 }),
  deletedAt: timestamp("deletedAt").defaultNow().notNull(),
});

export type ProposalDeletionAudit = typeof proposalDeletionAudits.$inferSelect;

/** Registro durável de rotinas de manutenção operacionais administradas pela plataforma. */
export const maintenanceJobs = mysqlTable("maintenanceJobs", {
  id: int("id").autoincrement().primaryKey(),
  jobKey: varchar("jobKey", { length: 100 }).notNull().unique(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MaintenanceJob = typeof maintenanceJobs.$inferSelect;
