import { COOKIE_NAME } from "@shared/const";
import { sendPDFReportEmail } from "./emailService";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveFileMetadata, getUserFiles, createBudgetRequest, getBudgetRequests, getBudgetRequestById, updateBudgetRequest, createTechnicalVisit, getTechnicalVisitsByBudgetId } from "./db";
import { storagePut } from "./storage";
import { sendCustomerConfirmationEmail, sendSalesTeamNotification, sendVisitScheduledEmail } from "./emailService";
import { generateSolarReportPDF, type SolarCalculationData } from "./pdfGenerator";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
