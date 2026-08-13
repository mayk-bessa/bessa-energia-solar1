import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const homeSource = readFileSync(resolve(projectRoot, 'client/src/pages/Home.tsx'), 'utf8');
const gallerySource = readFileSync(resolve(projectRoot, 'client/src/components/WelcomeGalleryModal.tsx'), 'utf8');

const localGalleryImages = [
  '/images/wallbox/wallbox-pulsar-plus.webp',
  '/images/wallbox/wallbox-paineis-solares.webp',
  '/images/wallbox/carport-carro-eletrico.webp',
  '/images/wallbox/estacionamento-carregamento-solar.webp',
  '/images/wallbox/carport-solar-profissional.webp',
];

describe('WelcomeGalleryModal', () => {
  it('is connected to the homepage and opens when the site is accessed', () => {
    expect(homeSource).toContain("const [isWelcomeGalleryOpen, setIsWelcomeGalleryOpen] = useState(true);");
    expect(homeSource).toContain('<WelcomeGalleryModal');
    expect(homeSource).toContain('onClose={() => setIsWelcomeGalleryOpen(false)}');
  });

  it('uses five local 1920 x 1280 image assets', () => {
    for (const imagePath of localGalleryImages) {
      expect(gallerySource).toContain(imagePath);
    }

    expect(gallerySource).toContain('width={1920}');
    expect(gallerySource).toContain('height={1280}');
  });

  it('provides close and navigation controls', () => {
    expect(gallerySource).toContain('aria-label="Fechar galeria"');
    expect(gallerySource).toContain('aria-label="Foto anterior"');
    expect(gallerySource).toContain('aria-label="Próxima foto"');
    expect(gallerySource).toContain("event.key === 'Escape'");
  });

  it('links the footer location icon to Google Maps', () => {
    expect(homeSource).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(homeSource).toContain('Abrir endereço da Bessa Energia no Google Maps');
    expect(homeSource).toContain('AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG');
  });
});
