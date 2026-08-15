import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const homeSource = readFileSync(resolve(import.meta.dirname, '../client/src/pages/Home.tsx'), 'utf8');

describe('Footer company information', () => {
  it('uses the requested summary and removes the previous copy', () => {
    expect(homeSource).toContain('A Bessa Energia é uma empresa especializada em soluções de energia solar fotovoltaica, focada em gerar economia de até 95% na conta de luz para residências, comércios e indústrias.');
    expect(homeSource).not.toContain('Líder profissional comercial para todas categorias. Especialização em energia solar, tecnologia renovável, sustentabilidade e consultoria energética.');
  });

  it('includes the complete company text in the popup', () => {
    for (const paragraph of [
      'Com mais de 500 clientes satisfeitos, oferecemos projetos personalizados de painéis solares, usinas fotovoltaicas e carregadores veiculares Wallbox.',
      'Embora nossa atuação cubra todo o estado de Minas Gerais, temos forte presença e atendimento direcionado para as regiões da Grande BH, Vale do Aço, Triângulo Mineiro e Sul de Minas, abrangendo todas as cidades atendidas pela concessionária CEMIG.',
      'Cuidamos de todo o processo para você: desde o estudo de viabilidade, instalação, até a homologação completa junto à CEMIG, além de oferecermos opções de financiamento facilitadas.',
      'Conecte sua casa ou empresa ao futuro da sustentabilidade com a Bessa Energia.',
    ]) expect(homeSource).toContain(paragraph);
    expect(homeSource).toContain('Sobre a Empresa');
    expect(homeSource).toContain('role="dialog"');
  });

  it('supports click, hover and keyboard focus', () => {
    expect(homeSource).toContain('aria-haspopup="dialog"');
    expect(homeSource).toContain('aria-expanded={isCompanyInfoOpen}');
    expect(homeSource).toContain('onClick={() => setIsCompanyInfoOpen((open) => !open)}');
    expect(homeSource).toContain('onMouseEnter={() => setIsCompanyInfoOpen(true)}');
    expect(homeSource).toContain('onMouseLeave={() => setIsCompanyInfoOpen(false)}');
    expect(homeSource).toContain('onFocus={() => setIsCompanyInfoOpen(true)}');
    expect(homeSource).toContain('aria-label="Fechar Sobre a Empresa"');
  });

  it('preserves existing footer destinations', () => {
    for (const item of [
      'https://www.google.com/maps/search/?api=1&query=',
      'https://www.instagram.com/bessa.energia/',
      'contato@bessaenergia.com.br',
      '(31) 9 9102-9003',
      'Galeria de Fotos',
      'Tire suas Dúvidas',
      'WallBox - Carregador Inteligente',
    ]) expect(homeSource).toContain(item);
  });
});
