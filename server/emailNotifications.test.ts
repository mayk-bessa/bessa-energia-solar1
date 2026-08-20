import { describe, expect, it, vi } from "vitest";
import {
  getCustomerConfirmationEmail,
  getReviewModerationNotificationEmail,
  getSalesTeamNotificationEmail,
  getVisitScheduledEmail,
} from "./emailTemplates";

describe("Email Templates", () => {
  describe("getCustomerConfirmationEmail", () => {
    it("should generate customer confirmation email with correct subject", () => {
      const email = getCustomerConfirmationEmail(
        "João Silva",
        "joao@example.com",
        "(31) 99102-9003"
      );

      expect(email.subject).toBe(
        "Confirmação de Solicitação de Orçamento - Bessa Energia"
      );
      expect(email.html).toContain("João Silva");
      expect(email.html).toContain("joao@example.com");
      expect(email.html).toContain("(31) 99102-9003");
    });

    it("should include visit date when provided", () => {
      const visitDate = "2026-05-15";
      const email = getCustomerConfirmationEmail(
        "Maria Santos",
        "maria@example.com",
        "(31) 98765-4321",
        visitDate
      );

      expect(email.html).toContain("Data da Visita Agendada");
    });

    it("should have proper HTML structure", () => {
      const email = getCustomerConfirmationEmail(
        "Test User",
        "test@example.com",
        "(31) 99999-9999"
      );

      expect(email.html).toContain("<!DOCTYPE html>");
      expect(email.html).toContain("</html>");
      expect(email.html).toContain("Bessa Energia");
    });
  });

  describe("getSalesTeamNotificationEmail", () => {
    it("should generate sales team notification with correct subject", () => {
      const email = getSalesTeamNotificationEmail(
        "Carlos Costa",
        "carlos@example.com",
        "(31) 91234-5678"
      );

      expect(email.subject).toContain("Novo Orçamento Solicitado");
      expect(email.subject).toContain("Carlos Costa");
      expect(email.html).toContain("Carlos Costa");
      expect(email.html).toContain("carlos@example.com");
    });

    it("should include visit date when provided", () => {
      const visitDate = "2026-05-20";
      const email = getSalesTeamNotificationEmail(
        "Ana Silva",
        "ana@example.com",
        "(31) 99999-8888",
        visitDate
      );

      expect(email.html).toContain("Data da Visita Agendada");
    });

    it("should have action items for sales team", () => {
      const email = getSalesTeamNotificationEmail(
        "Test Client",
        "test@example.com",
        "(31) 99999-9999"
      );

      expect(email.html).toContain("Revisar os dados do cliente");
      expect(email.html).toContain("Entrar em contato");
      expect(email.html).toContain("Preparar proposta");
    });
  });

  describe("getVisitScheduledEmail", () => {
    it("should generate visit scheduled email with correct subject", () => {
      const visitDate = "2026-05-25";
      const email = getVisitScheduledEmail(
        "Roberto Oliveira",
        visitDate,
        "Técnico João"
      );

      expect(email.subject).toBe("Visita Técnica Agendada - Bessa Energia");
      expect(email.html).toContain("Roberto Oliveira");
      expect(email.html).toContain("Técnico João");
    });

    it("should format visit date properly", () => {
      const visitDate = "2026-06-15";
      const email = getVisitScheduledEmail("Test User", visitDate);

      // Date formatting depends on locale, just check that date is present
      expect(email.html).toContain("junho de 2026");
      expect(email.html).toContain("Data:");
    });

    it("should include what to expect section", () => {
      const email = getVisitScheduledEmail(
        "Test User",
        "2026-06-20",
        "Técnico"
      );

      expect(email.html).toContain("O que esperar");
      expect(email.html).toContain("Análise completa");
      expect(email.html).toContain("Avaliação de consumo");
      expect(email.html).toContain("Proposta personalizada");
    });

    it("should include contact information", () => {
      const email = getVisitScheduledEmail("Test User", "2026-06-25");

      expect(email.html).toContain("(31) 99102-9003");
      expect(email.html).toContain("Bessa Energia");
    });
  });

  describe("getReviewModerationNotificationEmail", () => {
    it("gera um aviso de moderação com os dados da avaliação", () => {
      const email = getReviewModerationNotificationEmail({
        name: "Maria Silva",
        city: "Belo Horizonte/MG",
        rating: 5,
        projectType: "Usina residencial",
        comment: "Atendimento atencioso e instalação muito organizada.",
      });

      expect(email.subject).toContain("Nova avaliação pendente de moderação");
      expect(email.html).toContain("Maria Silva");
      expect(email.html).toContain("Belo Horizonte/MG");
      expect(email.html).toContain("5/5");
      expect(email.html).toContain("Usina residencial");
    });

    it("escapa o conteúdo da avaliação antes de inseri-lo no HTML", () => {
      const email = getReviewModerationNotificationEmail({
        name: "<cliente>",
        city: "BH",
        rating: 4,
        comment: "<script>alert('x')</script>",
      });

      expect(email.html).toContain("&lt;cliente&gt;");
      expect(email.html).toContain("&lt;script&gt;");
      expect(email.html).not.toContain("<script>alert");
    });
  });

  describe("Email HTML Structure", () => {
    it("all emails should have proper styling", () => {
      const customerEmail = getCustomerConfirmationEmail(
        "Test",
        "test@example.com",
        "(31) 99999-9999"
      );
      const salesEmail = getSalesTeamNotificationEmail(
        "Test",
        "test@example.com",
        "(31) 99999-9999"
      );
      const visitEmail = getVisitScheduledEmail("Test", "2026-06-30");

      expect(customerEmail.html).toContain("<style>");
      expect(salesEmail.html).toContain("<style>");
      expect(visitEmail.html).toContain("<style>");
    });

    it("all emails should have footer with company info", () => {
      const customerEmail = getCustomerConfirmationEmail(
        "Test",
        "test@example.com",
        "(31) 99999-9999"
      );
      const salesEmail = getSalesTeamNotificationEmail(
        "Test",
        "test@example.com",
        "(31) 99999-9999"
      );
      const visitEmail = getVisitScheduledEmail("Test", "2026-06-30");

      expect(customerEmail.html).toContain("© 2026 Bessa Energia");
      expect(salesEmail.html).toContain("© 2026 Bessa Energia");
      expect(visitEmail.html).toContain("© 2026 Bessa Energia");
    });
  });
});
