import { describe, it, expect } from 'vitest';
import WhatsAppButton from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('deve exportar um componente React válido', () => {
    expect(WhatsAppButton).toBeDefined();
    expect(typeof WhatsAppButton).toBe('function');
  });

  it('deve ter o número de telefone correto da Bessa Energia', () => {
    const component = WhatsAppButton();
    const href = (component as any).props.href;
    expect(href).toContain('5531991029003');
  });

  it('deve ter a URL correta do WhatsApp', () => {
    const component = WhatsAppButton();
    const href = (component as any).props.href;
    expect(href).toContain('https://wa.me/');
  });

  it('deve ter a mensagem pré-preenchida na URL', () => {
    const component = WhatsAppButton();
    const href = (component as any).props.href;
    expect(href).toContain('text=');
  });

  it('deve abrir em nova aba', () => {
    const component = WhatsAppButton();
    expect((component as any).props.target).toBe('_blank');
    expect((component as any).props.rel).toContain('noopener');
  });

  it('deve ter as classes CSS corretas para posicionamento flutuante', () => {
    const component = WhatsAppButton();
    const className = (component as any).props.className;
    expect(className).toContain('fixed');
    expect(className).toContain('bottom-6');
    expect(className).toContain('right-6');
    expect(className).toContain('z-40');
  });

  it('deve ter as classes CSS corretas para estilo do botão', () => {
    const component = WhatsAppButton();
    const className = (component as any).props.className;
    expect(className).toContain('bg-green-500');
    expect(className).toContain('hover:bg-green-600');
    expect(className).toContain('rounded-full');
  });
});
