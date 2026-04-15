import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveFileMetadata, getUserFiles, createBudgetRequest, getBudgetRequests, getBudgetRequestById, updateBudgetRequest } from "./db";
import { storagePut } from "./storage";
import nodemailer from "nodemailer";

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
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.SMTP_USER,
            to: input.recipientEmail,
            subject: `Nova Solicitação de Orçamento - ${input.fullName}`,
            html: `
              <h2>Nova Solicitação de Orçamento</h2>
              <p><strong>Nome:</strong> ${input.fullName}</p>
              <p><strong>Email:</strong> ${input.email}</p>
              <p><strong>Telefone:</strong> ${input.phone}</p>
              <hr />
              <p>Este é um email automático da solicitação de orçamento no site Bessa Energia.</p>
            `,
          };

          await transporter.sendMail(mailOptions);

          return { success: true, message: 'Solicitação enviada com sucesso' };
        } catch (error) {
          console.error('Email send error:', error);
          throw new Error('Falha ao enviar email');
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
