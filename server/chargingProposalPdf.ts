import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function truncate(value: string, limit: number) {
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

export async function generateChargingProposalPDF(data: ChargingProposalPdfData): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const blue = rgb(37 / 255, 60 / 255, 126 / 255);
  const orange = rgb(1, 105 / 255, 0);
  const ink = rgb(31 / 255, 41 / 255, 55 / 255);
  const paleBlue = rgb(238 / 255, 243 / 255, 1);
  const gray = rgb(100 / 255, 116 / 255, 139 / 255);
  const margin = 42;
  let y = height - 48;

  page.drawRectangle({ x: 0, y: height - 14, width, height: 14, color: orange });
  page.drawText("BESSA ENERGIA SOLAR", { x: margin, y, size: 20, font: bold, color: blue });
  page.drawText("Proposta Comercial — Estação de Recarga Veicular", { x: margin, y: y - 21, size: 10, font: regular, color: gray });
  y -= 64;

  page.drawRectangle({ x: margin, y: y - 74, width: width - margin * 2, height: 74, color: paleBlue });
  page.drawText("INTELBRAS HOME EVE 0074H", { x: margin + 14, y: y - 22, size: 15, font: bold, color: blue });
  page.drawText(`Proposta #${data.proposalId} · Emitida em ${new Date(data.createdAt).toLocaleDateString("pt-BR")}`, { x: margin + 14, y: y - 40, size: 9, font: regular, color: ink });
  page.drawText(`Cliente: ${truncate(data.clientName, 56)}`, { x: margin + 14, y: y - 57, size: 9, font: regular, color: ink });
  y -= 104;

  page.drawText("Escopo comercial", { x: margin, y, size: 13, font: bold, color: blue });
  y -= 20;
  const columns = { item: margin, quantity: 350, unit: 410, total: 495 };
  page.drawRectangle({ x: margin, y: y - 20, width: width - margin * 2, height: 20, color: blue });
  page.drawText("Componente", { x: columns.item + 8, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Qtd.", { x: columns.quantity, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Unitário", { x: columns.unit, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Subtotal", { x: columns.total, y: y - 13, size: 8, font: bold, color: rgb(1, 1, 1) });
  y -= 20;

  for (let index = 0; index < data.components.length; index += 1) {
    const component = data.components[index]!;
    if (y < 130) {
      page.drawText("Continuação do escopo na próxima proposta gerada.", { x: margin, y, size: 8, font: regular, color: gray });
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

  page.drawText("Premissas da instalação", { x: margin, y, size: 12, font: bold, color: blue });
  const notes = [
    "Os valores são estimativos e dependem da vistoria técnica, da infraestrutura disponível e das proteções necessárias.",
    "O escopo definitivo deve considerar circuito dedicado, aterramento, cabeamento e requisitos aplicáveis de segurança.",
    `Vendedor responsável: ${truncate(data.sellerName, 48)}.`,
  ];
  y -= 18;
  notes.forEach((note) => {
    page.drawText(`• ${truncate(note, 112)}`, { x: margin + 3, y, size: 8.5, font: regular, color: ink });
    y -= 17;
  });

  page.drawText("Bessa Energia Solar · (31) 99102-9003 · contato@bessaenergia.com.br", { x: margin, y: 36, size: 8, font: regular, color: gray });
  return Buffer.from(await pdf.save());
}
