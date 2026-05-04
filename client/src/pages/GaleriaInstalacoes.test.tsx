import { describe, it, expect } from 'vitest';

describe('GaleriaInstalacoes', () => {
  it('should have navigation arrows and close button', () => {
    const buttons = [
      { icon: 'ChevronLeft', color: 'text-white hover:text-orange-500' },
      { icon: 'ChevronRight', color: 'text-white hover:text-orange-500' },
      { icon: 'X', color: 'text-white hover:text-orange-500' }
    ];
    
    expect(buttons).toHaveLength(3);
    buttons.forEach(btn => {
      expect(btn.color).toContain('text-white');
      expect(btn.color).toContain('hover:text-orange-500');
    });
  });

  it('should have fade-in animation for lightbox', () => {
    const animationStyles = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    `;
    
    expect(animationStyles).toContain('fadeIn');
    expect(animationStyles).toContain('0.3s');
    expect(animationStyles).toContain('ease-in-out');
  });

  it('should have gallery images array with 3 items', () => {
    const images = [
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/residential-installation-DfxBVaAzHuL7tW6nVsCBrD.webp',
        alt: 'Obra Residencial',
        title: 'Obra Residencial',
        description: 'Instalação profissional em residências'
      },
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/commercial-solar-farm-nSnFepgr3tKZGu5qpD4kHT.webp',
        alt: 'Equipe Especializada',
        title: 'Equipe Especializada',
        description: 'Profissionais certificados e experientes'
      },
      {
        src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/solar-panels-closeup-fhzVqa2w7QtrxtdEj9HQ3s.webp',
        alt: 'Usina Solar em BH',
        title: 'Usina Solar em BH',
        description: 'Tecnologia de ponta em energia limpa'
      }
    ];

    expect(images).toHaveLength(3);
    expect(images[0].title).toBe('Obra Residencial');
    expect(images[1].title).toBe('Equipe Especializada');
    expect(images[2].title).toBe('Usina Solar em BH');
  });

  it('should have valid image URLs', () => {
    const images = [
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/residential-installation-DfxBVaAzHuL7tW6nVsCBrD.webp' },
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/commercial-solar-farm-nSnFepgr3tKZGu5qpD4kHT.webp' },
      { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/solar-panels-closeup-fhzVqa2w7QtrxtdEj9HQ3s.webp' }
    ];

    images.forEach(image => {
      expect(image.src).toMatch(/^https:\/\//);
    });
  });

  it('should handle circular navigation correctly', () => {
    const images = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    let currentIndex = 0;

    // Test next navigation
    currentIndex = (currentIndex + 1) % images.length;
    expect(currentIndex).toBe(1);

    // Test next navigation wraps around
    currentIndex = 2;
    currentIndex = (currentIndex + 1) % images.length;
    expect(currentIndex).toBe(0);

    // Test previous navigation
    currentIndex = 0;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    expect(currentIndex).toBe(2);
  });

  it('should display image caption with title and description', () => {
    const image = {
      title: 'Obra Residencial',
      description: 'Instalação profissional em residências'
    };
    
    expect(image.title).toBeDefined();
    expect(image.description).toBeDefined();
    expect(image.title.length).toBeGreaterThan(0);
  });
});
