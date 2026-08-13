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

  it('animates the popup with a subtle fade-in', () => {
    expect(gallerySource).toContain("import { motion } from 'framer-motion'");
    expect(gallerySource).toContain('initial={{ opacity: 0 }}');
    expect(gallerySource).toContain('animate={{ opacity: 1 }}');
    expect(gallerySource).toContain("duration: 0.32");
  });

  it('links the footer location icon to Google Maps', () => {
    expect(homeSource).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(homeSource).toContain('Abrir endereço da Bessa Energia no Google Maps');
    expect(homeSource).toContain('AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG');
  });

  it('adds an accessible Instagram link and an actionable QR code to the footer', () => {
    expect(homeSource).toContain("import QRCode from 'react-qr-code'");
    expect(homeSource).toContain('https://www.instagram.com/bessa.energia/');
    expect(homeSource).toContain('Abrir Instagram da Bessa Energia');
    expect(homeSource).toContain('Abrir Instagram da Bessa Energia pelo QR code');
    expect(homeSource).toContain('<QRCode');
    expect(homeSource).toContain('size={84}');
  });

  it('highlights the Instagram controls on hover while preserving focus visibility', () => {
    expect(homeSource).toContain('group-hover:scale-110');
    expect(homeSource).toContain('hover:bg-white/10');
    expect(homeSource).toContain('hover:shadow-orange-500/30');
    expect(homeSource).toContain('focus:ring-2 focus:ring-orange-500');
  });

  it('uses smooth color and scale transitions for both Instagram controls', () => {
    expect(homeSource).toContain('transition-[transform,background-color,color,box-shadow] duration-300 ease-out');
    expect(homeSource).toContain('transition-[transform,border-color,box-shadow,background-color] duration-300 ease-out');
    expect(homeSource).toContain('hover:scale-[1.03]');
    expect(homeSource).toContain('hover:scale-[1.06]');
  });

  it('adds the received gallery art with contextual descriptions and hides the resolution label', () => {
    expect(gallerySource).toContain('/manus-storage/reajustes-tarifarios-solar_4d0669db.jpg');
    expect(gallerySource).toContain('/manus-storage/condicoes-pagamento-solar_25e9a652.jpg');
    expect(gallerySource).toContain('/manus-storage/economia-previsibilidade-solar_287bce8e.jpg');
    expect(gallerySource).toContain('Proteção contra reajustes');
    expect(gallerySource).toContain('Condições de pagamento');
    expect(gallerySource).toContain('Economia com previsibilidade');
    expect(gallerySource).not.toContain('Imagem em alta resolução: 1920 × 1280 px');
  });
});
