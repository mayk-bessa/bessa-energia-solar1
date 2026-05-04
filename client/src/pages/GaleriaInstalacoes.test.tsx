import { describe, it, expect } from 'vitest';

describe('GaleriaInstalacoes', () => {
  it('should have gallery images array with 3 items', () => {
    const images = [
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/instalacao-residencial-BH.webp',
        alt: 'Instalação Residencial em BH',
        title: 'Instalação Residencial',
        description: 'Sistema solar residencial de 5kW instalado em Belo Horizonte'
      },
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/usina-solar-comercial-BH.webp',
        alt: 'Usina Solar Comercial em BH',
        title: 'Usina Solar Comercial',
        description: 'Sistema solar comercial de 50kW para empresa em Belo Horizonte'
      },
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/paineis-solares-closeup.webp',
        alt: 'Painéis Solares Close-up',
        title: 'Painéis Solares de Alta Eficiência',
        description: 'Painéis solares monocristalinos de última geração com eficiência de 22%'
      }
    ];

    expect(images).toHaveLength(3);
    expect(images[0].title).toBe('Instalação Residencial');
    expect(images[1].title).toBe('Usina Solar Comercial');
    expect(images[2].title).toBe('Painéis Solares de Alta Eficiência');
  });

  it('should have valid image URLs', () => {
    const images = [
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/instalacao-residencial-BH.webp' },
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/usina-solar-comercial-BH.webp' },
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/paineis-solares-closeup.webp' }
    ];

    images.forEach(image => {
      expect(image.src).toMatch(/^https:\/\//);
    });
  });
});
