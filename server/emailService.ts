/**
 * Email Service for Bessa Energia
 * Handles sending emails to customers and sales team
 */

import nodemailer from "nodemailer";
import {
  getCustomerConfirmationEmail,
  getReviewModerationNotificationEmail,
  getSalesTeamNotificationEmail,
  getVisitScheduledEmail,
  type ReviewNotificationInput,
} from "./emailTemplates";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // TLS
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendCustomerConfirmationEmail(
  clientName: string,
  clientEmail: string,
  phone: string,
  visitDate?: string
): Promise<boolean> {
  try {
    const template = getCustomerConfirmationEmail(
      clientName,
      clientEmail,
      phone,
      visitDate
    );

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: clientEmail,
      subject: template.subject,
      html: template.html,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email] Confirmation sent to ${clientEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send customer confirmation:", error);
    return false;
  }
}

export async function sendSalesTeamNotification(
  clientName: string,
  clientEmail: string,
  phone: string,
  visitDate?: string,
  salesTeamEmail: string = "vendas@bessaenergia.com.br"
): Promise<boolean> {
  try {
    const template = getSalesTeamNotificationEmail(
      clientName,
      clientEmail,
      phone,
      visitDate
    );

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: salesTeamEmail,
      subject: template.subject,
      html: template.html,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email] Sales notification sent to ${salesTeamEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send sales team notification:", error);
    return false;
  }
}

export async function sendReviewModerationNotification(review: ReviewNotificationInput): Promise<boolean> {
  try {
    const template = getReviewModerationNotificationEmail(review);
    const recipient = process.env.REVIEW_NOTIFICATION_EMAIL || "vendas@bessaenergia.com.br";
    await getTransporter().sendMail({
      from: process.env.SMTP_USER,
      to: recipient,
      subject: template.subject,
      html: template.html,
    });
    console.log(`[Email] Review moderation notification sent to ${recipient}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send review moderation notification:", error);
    return false;
  }
}

export async function sendVisitScheduledEmail(
  clientName: string,
  clientEmail: string,
  visitDate: string,
  technician?: string
): Promise<boolean> {
  try {
    const template = getVisitScheduledEmail(clientName, visitDate, technician);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: clientEmail,
      subject: template.subject,
      html: template.html,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email] Visit scheduled confirmation sent to ${clientEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send visit scheduled email:", error);
    return false;
  }
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 };

  for (const recipient of recipients) {
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: recipient,
        subject,
        html,
      };

      await getTransporter().sendMail(mailOptions);
      results.success++;
    } catch (error) {
      console.error(`[Email] Failed to send to ${recipient}:`, error);
      results.failed++;
    }
  }

  return results;
}

export async function sendPDFReportEmail(
  clientName: string,
  clientEmail: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: clientEmail,
      subject: "Seu Relatório de Análise Solar - Bessa Energia",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">Olá ${clientName},</h2>
          <p>Segue em anexo seu relatório de análise solar personalizado com os cálculos de economia e produção de energia.</p>
          <p>Este relatório contém:</p>
          <ul>
            <li>Análise de economia mensal e anual</li>
            <li>Estimativa de produção de energia</li>
            <li>Tempo de retorno do investimento</li>
            <li>Benefícios da energia solar</li>
          </ul>
          <p>Para dúvidas ou para agendar uma visita técnica, entre em contato conosco:</p>
          <p><strong>(31) 99102-9003</strong><br>vendas@bessaenergia.com.br</p>
          <p style="margin-top: 30px; color: #666; font-size: 12px;">© 2026 Bessa Energia - Painéis e Usina Solar</p>
        </div>
      `,
      attachments: [
        {
          filename: `relatorio-solar-${new Date().getTime()}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`[Email] PDF report sent to ${clientEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send PDF report:", error);
    return false;
  }
}

export async function sendChargingProposalEmail(
  clientName: string,
  clientEmail: string,
  pdfBuffer: Buffer,
  proposalId: number,
  signatureUrl?: string,
): Promise<boolean> {
  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_USER,
      to: clientEmail,
      subject: `Proposta Comercial #${proposalId} — Bessa Energia`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
          <div style="border-top: 5px solid #ff6900; padding-top: 20px;"></div>
          <h2 style="color: #253c7e; margin-bottom: 16px;">Olá, ${clientName},</h2>
          <p>Conforme nosso atendimento, encaminhamos em anexo a proposta comercial Bessa Energia.</p>
          <p>O documento apresenta o escopo estimado, os componentes previstos e o valor total. Após a vistoria técnica, nossa equipe confirmará a infraestrutura e as condições definitivas de instalação.</p>
          ${signatureUrl ? `<p style="margin: 24px 0;"><a href="${signatureUrl}" style="display: inline-block; padding: 12px 18px; background: #253c7e; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Aprovar proposta online</a></p><p style="font-size: 12px; color: #64748b;">Use este link para registrar seu aceite eletrônico durante o prazo de validade da proposta.</p>` : ""}
          <p>Ficamos à disposição para esclarecer dúvidas.</p>
          <p style="margin-top: 24px;"><strong>Bessa Energia Solar</strong><br />(31) 99102-9003<br />contato@bessaenergia.com.br</p>
        </div>
      `,
      attachments: [{
        filename: `proposta-estacao-recarga-${proposalId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      }],
    });
    console.log(`[Email] Charging proposal #${proposalId} sent to ${clientEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send charging proposal:", error);
    return false;
  }
}
