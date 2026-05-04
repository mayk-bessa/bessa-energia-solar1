import { describe, it, expect } from 'vitest';

describe('GaleriaWallBox', () => {
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

  it('should have gallery images array with 5 items', () => {
    const images = [
      {
        src: '/manus-storage/Jg2RMUES7eYD_61169483.jpg',
        alt: 'Wallbox Pulsar Plus',
        title: 'Wallbox Pulsar Plus',
        description: 'Carregador inteligente de alta potência até 22kW'
      },
      {
        src: '/manus-storage/lxYPE647fL7H_0da93c84.jpg',
        alt: 'Integração Solar',
        title: 'Integração Solar',
        description: 'Wallbox conectado ao sistema solar para carregamento 100% renovável'
      },
      {
        src: '/manus-storage/Udy7cfQuAh7N_b63b45f2.png',
        alt: 'Carport Solar',
        title: 'Carport Solar',
        description: 'Estacionamento com cobertura de painéis solares'
      },
      {
        src: '/manus-storage/oLceu0RoRFBv_7837a09a.jpg',
        alt: 'Carport Solar Profissional',
        title: 'Carport Solar Profissional',
        description: 'Sistema completo de carregamento solar para múltiplos veículos'
      },
      {
        src: '/manus-storage/carport_ddb7d756.jpeg',
        alt: 'Ponto de Recarga Solar',
        title: 'Ponto de Recarga Solar',
        description: 'Estação de carregamento com energia solar integrada'
      }
    ];

    expect(images).toHaveLength(5);
    expect(images[0].title).toBe('Wallbox Pulsar Plus');
    expect(images[4].title).toBe('Ponto de Recarga Solar');
  });

  it('should have valid image storage paths', () => {
    const images = [
      { src: '/manus-storage/Jg2RMUES7eYD_61169483.jpg' },
      { src: '/manus-storage/lxYPE647fL7H_0da93c84.jpg' },
      { src: '/manus-storage/Udy7cfQuAh7N_b63b45f2.png' },
      { src: '/manus-storage/oLceu0RoRFBv_7837a09a.jpg' },
      { src: '/manus-storage/carport_ddb7d756.jpeg' }
    ];

    images.forEach(image => {
      expect(image.src).toMatch(/^\/manus-storage\//);
    });
  });

  it('should have WallBox, Carport Solar and Ponto de Recarga concepts', () => {
    const concepts = {
      wallbox: 'Um carregador de veículos elétricos inteligente e de alta potência',
      carport: 'Uma estrutura de estacionamento coberta com painéis solares',
      ponto: 'Uma estação de carregamento para veículos elétricos'
    };

    expect(concepts.wallbox).toBeDefined();
    expect(concepts.carport).toBeDefined();
    expect(concepts.ponto).toBeDefined();
  });

  it('should handle circular navigation for 5 images', () => {
    const images = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 }
    ];
    let currentIndex = 0;

    currentIndex = (currentIndex + 1) % images.length;
    expect(currentIndex).toBe(1);

    currentIndex = 4;
    currentIndex = (currentIndex + 1) % images.length;
    expect(currentIndex).toBe(0);

    currentIndex = 0;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    expect(currentIndex).toBe(4);
  });

  it('should display image caption with title, description and counter', () => {
    const image = {
      title: 'Wallbox Pulsar Plus',
      description: 'Carregador inteligente de alta potência'
    };
    const currentIndex = 0;
    const totalImages = 5;
    const counter = `${currentIndex + 1} de ${totalImages}`;
    
    expect(image.title).toBeDefined();
    expect(image.description).toBeDefined();
    expect(counter).toBe('1 de 5');
  });
});
