/**
 * PDF Generator Service for Solar Calculator Reports
 * Generates professional PDF reports with solar energy calculations
 */

import { PDFDocument, rgb, degrees } from "pdf-lib";
import { readFileSync } from "fs";
import { join } from "path";

export const COMPANY_ADDRESS =
  "AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG";

export interface SolarCalculationData {
  monthlySpend: number;
  monthlyEconomy: number;
  annualEconomy: number;
  monthlyProduction: number;
  annualProduction: number;
  paybackYears: number;
  systemSize: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  generatedAt?: Date;
}

export async function generateSolarReportPDF(
  data: SolarCalculationData
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  // Define colors
  const primaryColor = rgb(1.0, 0.42, 0.21); // #FF6B35
  const secondaryColor = rgb(0.12, 0.23, 0.54); // #1E3A8A
  const textColor = rgb(0.2, 0.2, 0.2);
  const lightGray = rgb(0.95, 0.95, 0.95);

  let yPosition = height - 40;

  // Header with company info
  page.drawText("BESSA ENERGIA", {
    x: 40,
    y: yPosition,
    size: 28,
    color: primaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  page.drawText("Painéis e Usina Solar", {
    x: 40,
    y: yPosition - 20,
    size: 12,
    color: secondaryColor,
    font: await pdfDoc.embedFont("Helvetica"),
  });

  yPosition -= 50;

  // Title
  page.drawText("Relatório de Análise Solar", {
    x: 40,
    y: yPosition,
    size: 20,
    color: secondaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 30;

  // Generated date
  const generatedDate = data.generatedAt
    ? new Date(data.generatedAt).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR");

  page.drawText(`Gerado em: ${generatedDate}`, {
    x: 40,
    y: yPosition,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  yPosition -= 25;

  // Client info box
  if (data.clientName || data.clientEmail || data.clientPhone) {
    page.drawRectangle({
      x: 40,
      y: yPosition - 70,
      width: width - 80,
      height: 70,
      borderColor: primaryColor,
      borderWidth: 1,
      color: lightGray,
    });

    page.drawText("Informações do Cliente", {
      x: 50,
      y: yPosition - 15,
      size: 12,
      color: secondaryColor,
      font: await pdfDoc.embedFont("Helvetica-Bold"),
    });

    if (data.clientName) {
      page.drawText(`Nome: ${data.clientName}`, {
        x: 50,
        y: yPosition - 35,
        size: 10,
        color: textColor,
        font: await pdfDoc.embedFont("Helvetica"),
      });
    }

    if (data.clientEmail) {
      page.drawText(`Email: ${data.clientEmail}`, {
        x: 50,
        y: yPosition - 50,
        size: 10,
        color: textColor,
        font: await pdfDoc.embedFont("Helvetica"),
      });
    }

    if (data.clientPhone) {
      page.drawText(`Telefone: ${data.clientPhone}`, {
        x: 300,
        y: yPosition - 35,
        size: 10,
        color: textColor,
        font: await pdfDoc.embedFont("Helvetica"),
      });
    }

    yPosition -= 100;
  }

  // Main calculations section
  page.drawText("Análise de Economia Solar", {
    x: 40,
    y: yPosition,
    size: 14,
    color: secondaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 25;

  // Create calculation boxes
  const boxWidth = (width - 100) / 2;
  const boxHeight = 60;

  // Monthly spend box
  drawCalculationBox(
    page,
    40,
    yPosition - boxHeight,
    boxWidth,
    boxHeight,
    "Gasto Mensal Atual",
    `R$ ${data.monthlySpend.toFixed(2)}`,
    primaryColor,
    await pdfDoc.embedFont("Helvetica-Bold")
  );

  // Monthly economy box
  drawCalculationBox(
    page,
    40 + boxWidth + 20,
    yPosition - boxHeight,
    boxWidth,
    boxHeight,
    "Economia Mensal",
    `R$ ${data.monthlyEconomy.toFixed(2)}`,
    primaryColor,
    await pdfDoc.embedFont("Helvetica-Bold")
  );

  yPosition -= boxHeight + 20;

  // Annual economy box
  drawCalculationBox(
    page,
    40,
    yPosition - boxHeight,
    boxWidth,
    boxHeight,
    "Economia Anual",
    `R$ ${data.annualEconomy.toFixed(2)}`,
    secondaryColor,
    await pdfDoc.embedFont("Helvetica-Bold")
  );

  // Payback box
  drawCalculationBox(
    page,
    40 + boxWidth + 20,
    yPosition - boxHeight,
    boxWidth,
    boxHeight,
    "Tempo de Retorno",
    `${data.paybackYears.toFixed(1)} anos`,
    secondaryColor,
    await pdfDoc.embedFont("Helvetica-Bold")
  );

  yPosition -= boxHeight + 30;

  // Production section
  page.drawText("Produção de Energia", {
    x: 40,
    y: yPosition,
    size: 14,
    color: secondaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 25;

  // Monthly production
  page.drawText("Produção Mensal Estimada:", {
    x: 40,
    y: yPosition,
    size: 11,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  page.drawText(`${data.monthlyProduction.toFixed(0)} kWh`, {
    x: 250,
    y: yPosition,
    size: 11,
    color: primaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 20;

  // Annual production
  page.drawText("Produção Anual Estimada:", {
    x: 40,
    y: yPosition,
    size: 11,
    color: textColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  page.drawText(`${data.annualProduction.toFixed(0)} kWh`, {
    x: 250,
    y: yPosition,
    size: 11,
    color: primaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 30;

  // Benefits section
  page.drawText("Benefícios da Energia Solar", {
    x: 40,
    y: yPosition,
    size: 14,
    color: secondaryColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 20;

  const benefits = [
    "• Redução de até 95% na conta de energia",
    "• Valorização do imóvel",
    "• Proteção contra inflação de energia",
    "• Energia limpa e renovável",
    "• Retorno do investimento em poucos anos",
  ];

  for (const benefit of benefits) {
    page.drawText(benefit, {
      x: 50,
      y: yPosition,
      size: 10,
      color: textColor,
      font: await pdfDoc.embedFont("Helvetica"),
    });
    yPosition -= 15;
  }

  yPosition -= 20;

  // Footer
  page.drawLine({
    start: { x: 40, y: yPosition },
    end: { x: width - 40, y: yPosition },
    color: primaryColor,
    thickness: 1,
  });

  yPosition -= 15;

  page.drawText("Bessa Energia - Painéis e Usina Solar", {
    x: 40,
    y: yPosition,
    size: 9,
    color: rgb(0.5, 0.5, 0.5),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  page.drawText("(31) 99102-9003 | vendas@bessaenergia.com.br", {
    x: 40,
    y: yPosition - 12,
    size: 9,
    color: rgb(0.5, 0.5, 0.5),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  page.drawText("AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500,", {
    x: 40,
    y: yPosition - 24,
    size: 8,
    color: rgb(0.5, 0.5, 0.5),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  page.drawText("PARTE 1557 SAVASSI, BELO HORIZONTE/MG", {
    x: 40,
    y: yPosition - 35,
    size: 8,
    color: rgb(0.5, 0.5, 0.5),
    font: await pdfDoc.embedFont("Helvetica"),
  });

  // Save and return PDF bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function drawCalculationBox(
  page: any,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  value: string,
  color: any,
  boldFont: any
) {
  // Draw box background
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: color,
    borderWidth: 2,
    color: rgb(0.98, 0.98, 0.98),
  });

  // Draw label
  page.drawText(label, {
    x: x + 10,
    y: y + height - 25,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
    font: boldFont,
  });

  // Draw value
  page.drawText(value, {
    x: x + 10,
    y: y + 10,
    size: 16,
    color,
    font: boldFont,
  });
}
