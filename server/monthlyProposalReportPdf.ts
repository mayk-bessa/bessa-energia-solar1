import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { MonthlyProposalMetrics } from "./db";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export async function generateMonthlyProposalReportPdf(report: MonthlyProposalMetrics, sellerLabel: string): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(37 / 255, 60 / 255, 126 / 255);
  const orange = rgb(1, 105 / 255, 0);
  const gray = rgb(71 / 255, 85 / 255, 105 / 255);
  const margin = 44;

  page.drawRectangle({ x: 0, y: 770, width: 595.28, height: 71.89, color: blue });
  page.drawText("BESSA ENERGIA SOLAR", { x: margin, y: 805, size: 17, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Relatório mensal de desempenho comercial", { x: margin, y: 784, size: 10, font: regular, color: rgb(1, 1, 1) });
  page.drawText(`Período: ${report.month} · Escopo: ${sellerLabel}`, { x: margin, y: 748, size: 9, font: regular, color: gray });

  const cards = [
    ["Propostas geradas", String(report.totalProposals)],
    ["Propostas enviadas", String(report.sentProposals)],
    ["Valor gerado", currency.format(report.totalCents / 100)],
    ["Valor enviado", currency.format(report.sentTotalCents / 100)],
  ];
  cards.forEach(([label, value], index) => {
    const x = margin + (index % 2) * 255;
    const y = 680 - Math.floor(index / 2) * 80;
    page.drawRectangle({ x, y, width: 230, height: 58, color: index % 2 ? rgb(255 / 255, 247 / 255, 237 / 255) : rgb(239 / 255, 246 / 255, 255 / 255) });
    page.drawText(label, { x: x + 12, y: y + 39, size: 8, font: regular, color: gray });
    page.drawText(value, { x: x + 12, y: y + 17, size: 16, font: bold, color: index % 2 ? orange : blue });
  });

  let y = 510;
  page.drawText("Distribuição por vendedor", { x: margin, y, size: 12, font: bold, color: blue });
  y -= 24;
  page.drawRectangle({ x: margin, y: y - 20, width: 507, height: 20, color: blue });
  [["Vendedor", margin + 9], ["Geradas", 324], ["Enviadas", 396], ["Valor", 464]].forEach(([label, x]) => page.drawText(String(label), { x: Number(x), y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) }));
  y -= 20;
  for (const seller of report.bySeller.slice(0, 12)) {
    page.drawRectangle({ x: margin, y: y - 23, width: 507, height: 23, color: y % 2 ? rgb(248 / 255, 250 / 255, 252 / 255) : rgb(1, 1, 1) });
    page.drawText(seller.sellerName.slice(0, 38), { x: margin + 9, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(String(seller.totalProposals), { x: 335, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(String(seller.sentProposals), { x: 411, y: y - 15, size: 8, font: regular, color: gray });
    page.drawText(currency.format(seller.totalCents / 100), { x: 451, y: y - 15, size: 8, font: bold, color: blue });
    y -= 23;
  }
  page.drawText("Relatório gerado pelo painel comercial Bessa Energia.", { x: margin, y: 34, size: 7.5, font: regular, color: gray });
  return Buffer.from(await pdf.save());
}
