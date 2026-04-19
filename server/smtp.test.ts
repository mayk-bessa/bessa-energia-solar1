import { describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';

// Configuração SMTP com TLS na porta 587

describe('SMTP Configuration - Hostinger (TLS Port 587)', () => {
  it('should validate SMTP credentials are set', () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    expect(smtpHost).toBeDefined();
    expect(smtpPort).toBe(587);
    expect(smtpUser).toBeDefined();
    expect(smtpPass).toBeDefined();
    
    // Validar que as credenciais não estão vazias
    expect(smtpHost).not.toBe('');
    expect(smtpUser).not.toBe('');
    expect(smtpPass).not.toBe('');
    expect(smtpPort).toBeGreaterThan(0);
  });

  it('should have correct SMTP configuration', () => {
    expect(process.env.SMTP_HOST).toBe('smtp.hostinger.com');
    expect(process.env.SMTP_PORT).toBe('587');
    expect(process.env.SMTP_USER).toBe('contato@bessaenergia.com.br');
    expect(process.env.SMTP_PASS).toBeDefined();
  });

  it('should create nodemailer transporter with SMTP config', () => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // TLS
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    expect(transporter).toBeDefined();
    expect(transporter.options).toBeDefined();
    expect(transporter.options.host).toBe('smtp.hostinger.com');
    expect(transporter.options.port).toBe(587);
  });
});
