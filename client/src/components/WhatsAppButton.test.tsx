import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsAppButton from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('deve renderizar o botão flutuante do WhatsApp', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('deve ter o número de telefone correto da Bessa Energia', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toContain('5531991029003');
  });

  it('deve ter a URL correta do WhatsApp', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toContain('https://wa.me/');
  });

  it('deve ter a mensagem pré-preenchida na URL', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toContain('text=');
  });

  it('deve abrir em nova aba', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('deve ter o ícone de mensagem', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  it('deve ter as classes CSS corretas para posicionamento flutuante', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-40');
  });

  it('deve ter as classes CSS corretas para estilo do botão', () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('bg-green-500', 'hover:bg-green-600', 'rounded-full');
  });
});
