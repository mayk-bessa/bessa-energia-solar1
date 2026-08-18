import { COOKIE_NAME } from "@shared/const";
import { sendChargingProposalEmail, sendPDFReportEmail } from "./emailService";
import { ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router, protectedProcedure, sellerProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveFileMetadata, getUserFiles, createBudgetRequest, getBudgetRequests, getBudgetRequestById, updateBudgetRequest, createTechnicalVisit, getTechnicalVisitsByBudgetId } from "./db";
import { storagePut } from "./storage";
import { sendCustomerConfirmationEmail, sendSalesTeamNotification, sendVisitScheduledEmail } from "./emailService";
import { createReview, getApprovedReviews, getPendingReviews, updateReviewStatus } from "./db";
import { generateSolarReportPDF, type SolarCalculationData } from "./pdfGenerator";
import { createChargingProposal, createLocalUserAccount, deleteLocalSellerAccount, getChargingProposalById, getChargingProposals, getUsersForRoleManagement, markChargingProposalAsSent, setLocalSellerAccountActive, updateChargingProposalStatus, updateLocalSellerAccount, updateUserRole } from "./db";
import { generateChargingProposalPDF } from "./chargingProposalPdf";
import { randomUUID } from "crypto";
import { sdk } from "./_core/sdk";
import { authenticateLocalUser, hashLocalPassword } from "./localAuth";
import { storeProductImageLocally } from "./productImageStorage";

const chargingComponentSchema = z.object({
  id: z.string().min(1).max(120),
  name: z.string().trim().min(1).max(255),
  quantity: z.number().int().min(0).max(10000),
  unitPrice: z.number().min(0).max(10000000),
  imageUrl: z.string().max(2048).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    localLogin: publicProcedure
      .input(z.object({ email: z.string().trim().email(), password: z.string().min(1).max(512) }))
      .mutation(async ({ input, ctx }) => {
        const user = await authenticateLocalUser(input.email, input.password);
        if (!user) throw new Error("E-mail ou senha inválidos");
        const token = await sdk.createSessionToken(user.openId, { name: user.name ?? user.email ?? "Vendedor Bessa" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  budget: router({
    sendRequest: publicProcedure
      .input(z.object({
        fullName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        recipientEmail: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Save budget request to database
          const budgetRequest = await createBudgetRequest({
            clientName: input.fullName,
            clientEmail: input.email,
            clientPhone: input.phone,
            status: 'new',
          });

          // Send confirmation email to customer
          await sendCustomerConfirmationEmail(
            input.fullName,
            input.email,
            input.phone
          );

          // Send notification to sales team
          await sendSalesTeamNotification(
            input.fullName,
            input.email,
            input.phone,
            undefined,
            input.recipientEmail
          );

          return { success: true, message: 'Solicitação enviada com sucesso', budgetRequestId: budgetRequest?.id };
        } catch (error) {
          console.error('Email send error:', error);
          throw new Error('Falha ao enviar email');
        }
      }),

    scheduleVisit: publicProcedure
      .input(z.object({
        budgetRequestId: z.number(),
        visitDate: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createTechnicalVisit({
            budgetRequestId: input.budgetRequestId,
            scheduledDate: new Date(input.visitDate),
            status: 'scheduled',
            notes: input.notes || null,
          });
          return { success: true, message: 'Visita agendada com sucesso', result };
        } catch (error) {
          console.error('Schedule visit error:', error);
          throw new Error('Falha ao agendar visita');
        }
      }),

    getVisits: protectedProcedure
      .input(z.object({ budgetRequestId: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        return await getTechnicalVisitsByBudgetId(input.budgetRequestId);
      }),

    generateReport: publicProcedure
      .input(z.object({
        monthlySpend: z.number(),
        monthlyEconomy: z.number(),
        annualEconomy: z.number(),
        monthlyProduction: z.number(),
        annualProduction: z.number(),
        paybackYears: z.number(),
        systemSize: z.string(),
        clientName: z.string().optional(),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const pdfBuffer = await generateSolarReportPDF(input as SolarCalculationData);
          
          // If client email provided, send PDF via email
          if (input.clientEmail && input.clientName) {
            await sendPDFReportEmail(
              input.clientName,
              input.clientEmail,
              pdfBuffer
            );
          }

          // Return base64 encoded PDF for download
          const base64 = pdfBuffer.toString('base64');
          return {
            success: true,
            pdf: base64,
            filename: `relatorio-solar-${new Date().getTime()}.pdf`,
          };
        } catch (error) {
          console.error('PDF generation error:', error);
          throw new Error('Falha ao gerar relatório PDF');
        }
      }),
  }),

  admin: router({
    budgets: router({
      list: protectedProcedure
        .input(z.object({
          status: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        }))
        .query(async ({ input, ctx }) => {
          // Only admins can view all budgets
          if (ctx.user?.role !== 'admin') {
            throw new Error('Unauthorized');
          }
          return await getBudgetRequests({
            status: input.status,
            limit: input.limit || 50,
            offset: input.offset || 0,
          });
        }),
      
      getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
          if (ctx.user?.role !== 'admin') {
            throw new Error('Unauthorized');
          }
          return await getBudgetRequestById(input.id);
        }),
      
      updateStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(['new', 'contacted', 'proposal_sent', 'closed', 'rejected']),
          notes: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== 'admin') {
            throw new Error('Unauthorized');
          }
          return await updateBudgetRequest(input.id, {
            status: input.status,
            notes: input.notes,
          });
        }),
    }),
  }),

  chargingProposals: router({
    list: sellerProcedure.query(async ({ ctx }) => {
      const sellerId = ctx.user.role === "admin" ? undefined : ctx.user.id;
      return await getChargingProposals({ sellerId, limit: 100 });
    }),

    getById: sellerProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input, ctx }) => {
        const proposal = await getChargingProposalById(input.id);
        if (!proposal) return null;
        if (ctx.user.role !== "admin" && proposal.sellerId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        return proposal;
      }),

    save: sellerProcedure
      .input(z.object({
        clientName: z.string().trim().min(2).max(255),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().trim().max(20).optional(),
        sellerName: z.string().trim().max(255).optional(),
        components: z.array(chargingComponentSchema).min(1).max(100),
      }))
      .mutation(async ({ input, ctx }) => {
        const totalCents = Math.round(input.components.reduce(
          (sum, component) => sum + component.quantity * component.unitPrice,
          0,
        ) * 100);

        const result = await createChargingProposal({
          sellerId: ctx.user.id,
          sellerName: input.sellerName || ctx.user.name || "Vendedor Bessa Energia",
          clientName: input.clientName,
          clientEmail: input.clientEmail || null,
          clientPhone: input.clientPhone || null,
          componentsJson: JSON.stringify(input.components),
          totalCents,
          status: "pending",
        });

        return { success: true, proposalId: result.id, totalCents };
      }),

    uploadProductImage: sellerProcedure
      .input(z.object({
        fileName: z.string().trim().min(1).max(150),
        dataUrl: z.string().min(32).max(7_000_000),
      }))
      .mutation(async ({ input, ctx }) => {
        const match = input.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
        if (!match) throw new Error("Envie uma imagem PNG, JPEG ou WebP válida");
        const [, contentType, encoded] = match;
        const buffer = Buffer.from(encoded, "base64");
        if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB");

        const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
        let stored: { key: string; url: string };
        try {
          stored = await storagePut(
            `charging-proposals/${ctx.user.id}/products/${randomUUID()}.${extension}`,
            buffer,
            contentType,
          );
        } catch (error) {
          console.warn("[Product images] Storage remoto indisponível; usando armazenamento local do VPS.", error);
          stored = await storeProductImageLocally(buffer, extension);
        }
        return { url: stored.url, key: stored.key };
      }),

    duplicate: sellerProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        const source = await getChargingProposalById(input.id);
        if (!source) throw new Error("Proposta não encontrada");
        if (ctx.user.role !== "admin" && source.sellerId !== ctx.user.id) throw new Error("Unauthorized");

        const result = await createChargingProposal({
          sellerId: ctx.user.id,
          sellerName: ctx.user.name || source.sellerName,
          clientName: `${source.clientName} — cópia`,
          clientEmail: source.clientEmail,
          clientPhone: source.clientPhone,
          componentsJson: source.componentsJson,
          totalCents: source.totalCents,
          status: "pending",
        });
        return { success: true, proposalId: result.id };
      }),

    updateStatus: sellerProcedure
      .input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "approved", "rejected"]) }))
      .mutation(async ({ input, ctx }) => {
        const proposal = await getChargingProposalById(input.id);
        if (!proposal) throw new Error("Proposta não encontrada");
        if (ctx.user.role !== "admin" && proposal.sellerId !== ctx.user.id) throw new Error("Unauthorized");
        await updateChargingProposalStatus(input.id, input.status);
        return { success: true };
      }),

    sendEmail: sellerProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        const proposal = await getChargingProposalById(input.id);
        if (!proposal) throw new Error("Proposta não encontrada");
        if (ctx.user.role !== "admin" && proposal.sellerId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        if (!proposal.clientEmail) throw new Error("Informe o e-mail da cliente antes de enviar a proposta");

        let rawComponents: unknown;
        try {
          rawComponents = JSON.parse(proposal.componentsJson);
        } catch {
          throw new Error("Os componentes salvos na proposta estão inválidos");
        }
        const parsedComponents = z.array(chargingComponentSchema).safeParse(rawComponents);
        if (!parsedComponents.success) throw new Error("Os componentes salvos na proposta estão inválidos");

        const pdf = await generateChargingProposalPDF({
          proposalId: proposal.id,
          clientName: proposal.clientName,
          sellerName: proposal.sellerName,
          components: parsedComponents.data,
          totalCents: proposal.totalCents,
          createdAt: proposal.createdAt,
        });
        const sent = await sendChargingProposalEmail(proposal.clientName, proposal.clientEmail, pdf, proposal.id);
        if (!sent) throw new Error("Não foi possível enviar o e-mail da proposta");

        await markChargingProposalAsSent(proposal.id);
        return { success: true };
      }),

    previewPdf: sellerProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input, ctx }) => {
        const proposal = await getChargingProposalById(input.id);
        if (!proposal) throw new Error("Proposta não encontrada");
        if (ctx.user.role !== "admin" && proposal.sellerId !== ctx.user.id) throw new Error("Unauthorized");
        const parsedComponents = z.array(chargingComponentSchema).safeParse(JSON.parse(proposal.componentsJson));
        if (!parsedComponents.success) throw new Error("Os componentes salvos na proposta estão inválidos");
        const pdf = await generateChargingProposalPDF({
          proposalId: proposal.id,
          clientName: proposal.clientName,
          sellerName: proposal.sellerName,
          components: parsedComponents.data,
          totalCents: proposal.totalCents,
          createdAt: proposal.createdAt,
        });
        return { dataUrl: `data:application/pdf;base64,${pdf.toString("base64")}` };
      }),
  }),

  salesTeam: router({
    listUsers: adminProcedure.query(async () => getUsersForRoleManagement()),
    createLocalSeller: adminProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email(),
        password: z.string().min(16).max(512),
      }))
      .mutation(async ({ input }) => {
        const user = await createLocalUserAccount({
          name: input.name,
          email: input.email,
          passwordHash: await hashLocalPassword(input.password),
          role: "seller",
        });
        return { success: true, id: user.id };
      }),
    updateLocalSeller: adminProcedure
      .input(z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email(),
        password: z.string().min(16).max(512).optional(),
      }))
      .mutation(async ({ input }) => {
        await updateLocalSellerAccount({
          id: input.id,
          name: input.name,
          email: input.email,
          passwordHash: input.password ? await hashLocalPassword(input.password) : undefined,
        });
        return { success: true };
      }),
    setLocalSellerActive: adminProcedure
      .input(z.object({ id: z.number().int().positive(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        await setLocalSellerAccountActive(input.id, input.isActive);
        return { success: true };
      }),
    deleteLocalSeller: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteLocalSellerAccount(input.id);
        return { success: true };
      }),
    updateRole: adminProcedure
      .input(z.object({ id: z.number().int().positive(), role: z.enum(["user", "seller", "admin"]) }))
      .mutation(async ({ input }) => {
        await updateUserRole(input.id, input.role);
        return { success: true };
      }),
  }),

  reviews: router({
    listApproved: publicProcedure.query(async () => getApprovedReviews()),

    submit: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(255),
        city: z.string().trim().min(2).max(120),
        rating: z.number().int().min(1).max(5),
        comment: z.string().trim().min(10).max(1000),
        projectType: z.string().trim().max(120).optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createReview({ ...input, status: "pending" });
        return { success: true, reviewId: result?.id };
      }),

    listPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return await getPendingReviews();
    }),

    moderate: protectedProcedure
      .input(z.object({ id: z.number(), status: z.enum(["approved", "rejected"]) }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        await updateReviewStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  files: router({
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const buffer = Buffer.from(input.fileData, 'base64');
          
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(7);
          const fileKey = `files/${ctx.user.id}/${timestamp}-${random}-${input.fileName}`;
          
          const { url } = await storagePut(fileKey, buffer, input.mimeType);
          
          await saveFileMetadata({
            userId: ctx.user.id,
            fileName: input.fileName,
            fileKey,
            url,
            mimeType: input.mimeType,
            fileSize: buffer.length,
          });
          
          return { url, fileName: input.fileName };
        } catch (error) {
          console.error('File upload error:', error);
          throw new Error('Failed to upload file');
        }
      }),
    
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserFiles(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
