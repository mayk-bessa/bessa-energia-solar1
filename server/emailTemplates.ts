/**
 * Email Templates for Bessa Energia
 * Provides HTML templates for customer confirmations and sales team notifications
 */

export interface EmailTemplate {
  subject: string;
  html: string;
}

export function getCustomerConfirmationEmail(
  clientName: string,
  email: string,
  phone: string,
  visitDate?: string
): EmailTemplate {
  return {
    subject: "Confirmação de Solicitação de Orçamento - Bessa Energia",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #1E3A8A 100%); color: white; padding: 20px; border-radius: 5px; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-left: 4px solid #FF6B35; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            .button { background: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Obrigado por sua Solicitação!</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${clientName}</strong>,</p>
              
              <p>Recebemos sua solicitação de orçamento para energia solar. Estamos analisando seus dados e em breve um especialista entrará em contato com você.</p>
              
              <h3>Dados da Solicitação:</h3>
              <ul>
                <li><strong>Nome:</strong> ${clientName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Telefone:</strong> ${phone}</li>
                ${visitDate ? `<li><strong>Data da Visita Agendada:</strong> ${new Date(visitDate).toLocaleDateString('pt-BR')}</li>` : ''}
              </ul>
              
              <p>Você também pode:</p>
              <ul>
                <li>Ligar para <strong>(31) 99102-9003</strong></li>
                <li>Enviar email para <strong>vendas@bessaenergia.com.br</strong></li>
              </ul>
              
              <p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Bessa Energia</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2026 Bessa Energia - Painéis e Usina Solar</p>
              <p>Rua Vaga 241, Bairro Savassi, Belo Horizonte - MG</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function getSalesTeamNotificationEmail(
  clientName: string,
  email: string,
  phone: string,
  visitDate?: string
): EmailTemplate {
  return {
    subject: `🔔 Novo Orçamento Solicitado - ${clientName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1E3A8A; color: white; padding: 20px; border-radius: 5px; }
            .content { padding: 20px; background: #f0f4ff; margin: 20px 0; border-left: 4px solid #FF6B35; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            .highlight { background: #FFE5CC; padding: 10px; border-radius: 3px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Novo Orçamento Recebido</h1>
            </div>
            
            <div class="content">
              <p>Uma nova solicitação de orçamento foi recebida no site Bessa Energia.</p>
              
              <div class="highlight">
                <h3>Informações do Cliente:</h3>
                <ul style="margin: 10px 0;">
                  <li><strong>Nome:</strong> ${clientName}</li>
                  <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
                  <li><strong>Telefone:</strong> <a href="tel:${phone}">${phone}</a></li>
                  ${visitDate ? `<li><strong>Data da Visita Agendada:</strong> ${new Date(visitDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>` : ''}
                </ul>
              </div>
              
              <p><strong>Ação Recomendada:</strong></p>
              <ol>
                <li>Revisar os dados do cliente</li>
                <li>Entrar em contato para agendar visita técnica (se não agendada)</li>
                <li>Preparar proposta personalizada</li>
              </ol>
              
              <p style="margin-top: 30px; color: #666; font-size: 12px;">
                Este é um email automático. Por favor, acesse o painel administrativo para gerenciar este orçamento.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 Bessa Energia - Painéis e Usina Solar</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function getVisitScheduledEmail(
  clientName: string,
  visitDate: string,
  technician?: string
): EmailTemplate {
  const formattedDate = new Date(visitDate).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    subject: "Visita Técnica Agendada - Bessa Energia",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #1E3A8A 100%); color: white; padding: 20px; border-radius: 5px; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-left: 4px solid #FF6B35; }
            .highlight { background: #FFE5CC; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Visita Técnica Confirmada!</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${clientName}</strong>,</p>
              
              <p>Sua visita técnica foi confirmada com sucesso!</p>
              
              <div class="highlight">
                <h3>📅 Detalhes da Visita:</h3>
                <p><strong>Data:</strong> ${formattedDate}</p>
                ${technician ? `<p><strong>Técnico:</strong> ${technician}</p>` : ''}
                <p><strong>Local:</strong> Seu endereço (conforme registrado)</p>
              </div>
              
              <p><strong>O que esperar:</strong></p>
              <ul>
                <li>Análise completa do seu imóvel</li>
                <li>Avaliação de consumo de energia</li>
                <li>Proposta personalizada de sistema solar</li>
                <li>Resposta a todas as suas dúvidas</li>
              </ul>
              
              <p>Se precisar remarcar, ligue para <strong>(31) 99102-9003</strong>.</p>
              
              <p style="margin-top: 30px;">Atenciosamente,<br><strong>Equipe Bessa Energia</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2026 Bessa Energia - Painéis e Usina Solar</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export type ReviewNotificationInput = {
  name: string;
  city: string;
  rating: number;
  comment: string;
  projectType?: string;
};

function escapeReviewHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function getReviewModerationNotificationEmail(review: ReviewNotificationInput): EmailTemplate {
  const name = escapeReviewHtml(review.name);
  const city = escapeReviewHtml(review.city);
  const comment = escapeReviewHtml(review.comment);
  const projectType = review.projectType ? escapeReviewHtml(review.projectType) : "Não informado";

  return {
    subject: `Nova avaliação pendente de moderação — ${review.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #253c7e; color: #ffffff; padding: 22px; }
            .content { background: #f4f6f8; border-left: 4px solid #ff6900; margin: 20px 0; padding: 20px; }
            .rating { color: #ff6900; font-size: 20px; font-weight: bold; }
            .comment { background: #ffffff; padding: 15px; margin-top: 16px; }
            .footer { color: #5e6875; font-size: 12px; margin-top: 25px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Nova avaliação recebida</h1></div>
            <div class="content">
              <p>Uma nova avaliação foi registrada no site e está aguardando moderação.</p>
              <p><strong>Cliente:</strong> ${name}<br />
              <strong>Cidade:</strong> ${city}<br />
              <strong>Projeto:</strong> ${projectType}<br />
              <strong>Nota:</strong> <span class="rating">${review.rating}/5</span></p>
              <div class="comment"><strong>Depoimento:</strong><br />“${comment}”</div>
              <p>Entre no painel administrativo para aprovar ou rejeitar o conteúdo.</p>
            </div>
            <div class="footer">© 2026 Bessa Energia Solar · Notificação automática de moderação</div>
          </div>
        </body>
      </html>
    `,
  };
}
