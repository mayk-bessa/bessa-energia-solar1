import { PDFDocument, type PDFImage, rgb, StandardFonts } from "pdf-lib";

export type ChargingProposalPdfComponent = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type ChargingProposalPdfData = {
  proposalId: number;
  clientName: string;
  sellerName: string;
  components: ChargingProposalPdfComponent[];
  totalCents: number;
  createdAt: Date;
  projectType?: "solar" | "ev_charging" | "hybrid";
  coverArt?: "solar-home-vehicle" | "photovoltaic" | "ev-charging";
  validUntil?: Date | null;
  signedAt?: Date | null;
  signedByName?: string | null;
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const PARTNERSHIP_STRIP_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663417025632/yeqKcLNpdRHjuhLq.png";
const SOLAR_HERO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663417025632/YfNasSDHHUdiTmIq.png";
const COVER_ART_URLS: Record<NonNullable<ChargingProposalPdfData["coverArt"]>, string> = {
  "solar-home-vehicle": "/manus-storage/capa-proposta-hibrida_7c530a92.png",
  photovoltaic: "/manus-storage/capa-proposta-fotovoltaica_5c09c052.png",
  "ev-charging": "/manus-storage/capa-proposta-carregamento_540f77e1.png",
};

function truncate(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

async function embedRemotePng(pdf: PDFDocument, url: string): Promise<PDFImage | undefined> {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) return undefined;

  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    return await pdf.embedPng(await response.arrayBuffer());
  } catch {
    return undefined;
  }
}

function drawPartnershipFallback(page: ReturnType<PDFDocument["addPage"]>, x: number, y: number, width: number, height: number, blue: ReturnType<typeof rgb>, orange: ReturnType<typeof rgb>, green: ReturnType<typeof rgb>, white: ReturnType<typeof rgb>, bold: Awaited<ReturnType<PDFDocument["embedFont"]>>) {
  page.drawText("REVENDA", { x, y: y + height - 14, size: 7.5, font: bold, color: green });
  page.drawText("BESSA", { x, y: y + height - 34, size: 18, font: bold, color: blue });
  page.drawText("ENERGIA", { x: x + 55, y: y + height - 34, size: 18, font: bold, color: orange });
  page.drawRectangle({ x: x + width - 122, y, width: 122, height, color: green });
  page.drawText("Parceiro credenciado", { x: x + width - 111, y: y + height - 16, size: 6.5, font: bold, color: white });
  page.drawText("intelbras", { x: x + width - 108, y: y + 12, size: 18, font: bold, color: white });
}

function drawSectionBar(page: ReturnType<PDFDocument["addPage"]>, title: string, x: number, y: number, width: number, font: Awaited<ReturnType<PDFDocument["embedFont"]>>, orange: ReturnType<typeof rgb>, white: ReturnType<typeof rgb>) {
  page.drawRectangle({ x, y: y - 18, width, height: 18, color: orange });
  page.drawText(title, { x: x + 10, y: y - 12, size: 8.5, font, color: white });
}

export async function generateChargingProposalPDF(data: ChargingProposalPdfData): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const cover = pdf.addPage([595.28, 841.89]);
  const { width, height } = cover.getSize();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(37 / 255, 60 / 255, 126 / 255);
  const orange = rgb(1, 105 / 255, 0);
  const green = rgb(8 / 255, 182 / 255, 63 / 255);
  const ink = rgb(31 / 255, 41 / 255, 55 / 255);
  const paleBlue = rgb(238 / 255, 243 / 255, 1);
  const paleOrange = rgb(1, 243 / 255, 233 / 255);
  const gray = rgb(100 / 255, 116 / 255, 139 / 255);
  const margin = 42;

  const [partnershipStrip, solarHero] = await Promise.all([
    embedRemotePng(pdf, PARTNERSHIP_STRIP_URL),
    embedRemotePng(pdf, COVER_ART_URLS[data.coverArt ?? "solar-home-vehicle"] || SOLAR_HERO_URL),
  ]);

  if (partnershipStrip) {
    cover.drawImage(partnershipStrip, { x: margin, y: height - 172, width: width - margin * 2, height: 132 });
  } else {
    drawPartnershipFallback(cover, margin, height - 111, width - margin * 2, 58, blue, orange, green, rgb(1, 1, 1), bold);
  }

  if (solarHero) {
    cover.drawImage(solarHero, { x: margin, y: height - 410, width: width - margin * 2, height: 210 });
  } else {
    cover.drawRectangle({ x: margin, y: height - 410, width: width - margin * 2, height: 210, color: paleBlue });
  }

  cover.drawRectangle({ x: 160, y: height - 435, width: 275, height: 100, color: rgb(1, 1, 1), borderColor: orange, borderWidth: 1.3 });
  cover.drawText("Proposta técnica", { x: 184, y: height - 374, size: 19, font: bold, color: blue });
  cover.drawText("e comercial", { x: 229, y: height - 401, size: 19, font: bold, color: blue });
  cover.drawText("Soluções Bessa Energia com tecnologia Intelbras", { x: 178, y: height - 420, size: 8.3, font: regular, color: gray });

  const metaY = height - 483;
  [
    ["CLIENTE", truncate(data.clientName, 28)],
    ["PROPOSTA", `#${data.proposalId}`],
    ["VALIDADE", data.validUntil ? new Date(data.validUntil).toLocaleDateString("pt-BR") : "10 dias"],
  ].forEach(([label, value], index) => {
    const x = margin + index * 170;
    cover.drawText(label, { x, y: metaY, size: 7, font: bold, color: orange });
    cover.drawText(value, { x, y: metaY - 15, size: 8.5, font: regular, color: ink });
  });
  cover.drawRectangle({ x: margin, y: metaY - 72, width: width - margin * 2, height: 49, color: blue });
  cover.drawText("Bessa Energia Solar", { x: margin + 16, y: metaY - 43, size: 10, font: bold, color: rgb(1, 1, 1) });
  cover.drawText("Revenda e parceira credenciada Intelbras.", { x: margin + 16, y: metaY - 58, size: 7.7, font: regular, color: rgb(1, 1, 1) });
  cover.drawText("Energia, tecnologia e mobilidade", { x: width - 203, y: metaY - 44, size: 8.2, font: bold, color: orange });
  cover.drawText(`Emitida em ${new Date(data.createdAt).toLocaleDateString("pt-BR")}`, { x: margin, y: 45, size: 7.5, font: regular, color: gray });

  const page = pdf.addPage([595.28, 841.89]);
  if (partnershipStrip) {
    page.drawImage(partnershipStrip, { x: margin, y: height - 160, width: width - margin * 2, height: 132 });
  } else {
    drawPartnershipFallback(page, margin, height - 85, width - margin * 2, 34, blue, orange, green, rgb(1, 1, 1), bold);
  }
  drawSectionBar(page, "Escopo técnico e investimento", margin, height - 190, width - margin * 2, bold, orange, rgb(1, 1, 1));
  page.drawText("Itens previstos para a solução de energia solar, carregamento veicular ou combinação das duas frentes.", { x: margin, y: height - 219, size: 8.4, font: regular, color: gray });
  let y = height - 245;
  const columns = { item: margin, quantity: 350, unit: 410, total: 495 };
  page.drawRectangle({ x: margin, y: y - 20, width: width - margin * 2, height: 20, color: blue });
  page.drawText("Componente", { x: columns.item + 8, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Qtd.", { x: columns.quantity, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Unitário", { x: columns.unit, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Subtotal", { x: columns.total, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  y -= 20;

  for (let index = 0; index < data.components.length; index += 1) {
    const component = data.components[index]!;
    if (y < 285) {
      page.drawText("Itens adicionais serão detalhados na confirmação comercial.", { x: margin, y, size: 8, font: regular, color: gray });
      break;
    }
    const rowColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(248 / 255, 250 / 255, 252 / 255);
    page.drawRectangle({ x: margin, y: y - 25, width: width - margin * 2, height: 25, color: rowColor });
    page.drawText(truncate(component.name, 46), { x: columns.item + 8, y: y - 16, size: 8, font: regular, color: ink });
    page.drawText(String(component.quantity), { x: columns.quantity, y: y - 16, size: 8, font: regular, color: ink });
    page.drawText(brl.format(component.unitPrice), { x: columns.unit, y: y - 16, size: 8, font: regular, color: ink });
    page.drawText(brl.format(component.quantity * component.unitPrice), { x: columns.total, y: y - 16, size: 8, font: bold, color: blue });
    y -= 25;
  }

  y -= 16;
  page.drawRectangle({ x: margin, y: y - 54, width: width - margin * 2, height: 54, color: orange });
  page.drawText("VALOR TOTAL ESTIMADO", { x: margin + 14, y: y - 19, size: 9, font: bold, color: rgb(1, 1, 1) });
  page.drawText(brl.format(data.totalCents / 100), { x: margin + 14, y: y - 42, size: 19, font: bold, color: rgb(1, 1, 1) });
  y -= 82;

  drawSectionBar(page, "Condições e aceite da proposta", margin, y, width - margin * 2, bold, orange, rgb(1, 1, 1));
  y -= 38;
  const notes = [
    "Validade e disponibilidade: valores, prazos e equipamentos dependem de confirmação comercial e técnica.",
    "Garantias: aplicáveis conforme os termos dos fabricantes e serviços descritos na proposta final.",
    `Atendimento Bessa: vendedor responsável ${truncate(data.sellerName, 48)}.`,
    data.signedAt ? `Aceite eletrônico registrado em ${new Date(data.signedAt).toLocaleString("pt-BR")}, por ${truncate(data.signedByName || "cliente", 48)}.` : "Aceite eletrônico: disponível pelo link enviado à cliente durante a validade da proposta.",
  ];
  notes.forEach((note) => {
    page.drawCircle({ x: margin + 8, y: y + 3, size: 7, color: blue });
    page.drawText("•", { x: margin + 5.6, y: y - 0.5, size: 8, font: bold, color: rgb(1, 1, 1) });
    page.drawText(truncate(note, 106), { x: margin + 21, y, size: 8.2, font: regular, color: ink });
    y -= 19;
  });
  page.drawRectangle({ x: margin, y: y - 66, width: width - margin * 2, height: 66, color: paleOrange, borderColor: rgb(210 / 255, 214 / 255, 221 / 255), borderWidth: 0.5 });
  page.drawText("Dados do cliente", { x: margin + 14, y: y - 17, size: 8.5, font: bold, color: blue });
  page.drawText("Nome:", { x: margin + 14, y: y - 35, size: 7.5, font: regular, color: gray });
  page.drawText("Data:", { x: margin + 165, y: y - 35, size: 7.5, font: regular, color: gray });
  page.drawText("CPF/CNPJ:", { x: margin + 300, y: y - 35, size: 7.5, font: regular, color: gray });
  page.drawLine({ start: { x: margin + 14, y: y - 54 }, end: { x: margin + 240, y: y - 54 }, thickness: 0.6, color: gray });
  page.drawText("Assinatura do cliente", { x: margin + 14, y: y - 63, size: 6.8, font: regular, color: gray });
  page.drawText("Bessa Energia Solar · (31) 99102-9003 · contato@bessaenergia.com.br", { x: margin, y: 34, size: 7.4, font: regular, color: gray });
  return Buffer.from(await pdf.save());
}
