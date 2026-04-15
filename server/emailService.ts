/**
 * Email Service for Bessa Energia
 * Handles sending emails to customers and sales team
 */

import nodemailer from "nodemailer";
import {
  getCustomerConfirmationEmail,
  getSalesTeamNotificationEmail,
  getVisitScheduledEmail,
} from "./emailTemplates";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
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
