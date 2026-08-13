import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type WelcomeGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const galleryImages = [
  {
    src: '/images/wallbox/wallbox-pulsar-plus.webp',
    alt: 'Wallbox Pulsar Plus instalado em ambiente residencial',
    title: 'Wallbox Pulsar Plus',
  },
  {
    src: '/images/wallbox/wallbox-paineis-solares.webp',
    alt: 'Wallbox integrado a painéis solares',
    title: 'Integração Solar',
  },
  {
    src: '/images/wallbox/carport-carro-eletrico.webp',
    alt: 'Carport solar com carro elétrico',
    title: 'Carport Solar',
  },
  {
    src: '/images/wallbox/estacionamento-carregamento-solar.webp',
    alt: 'Estacionamento com carregamento solar',
    title: 'Mobilidade Elétrica',
  },
  {
    src: '/images/wallbox/carport-solar-profissional.webp',
    alt: 'Carport solar profissional com carregador veicular',
    title: 'Projeto Profissional',
  },
];

export default function WelcomeGalleryModal({ isOpen, onClose }: WelcomeGalleryModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedImage = galleryImages[selectedIndex];
  const previousImage = () => setSelectedIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setSelectedIndex((index) => (index + 1) % galleryImages.length);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-gallery-title"
    >
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Bessa Energia</p>
            <h2 id="welcome-gallery-title" className="text-xl font-bold text-slate-900 sm:text-2xl">Galeria de Projetos</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Fechar galeria"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative bg-slate-100">
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={1920}
            height={1280}
            className="h-auto max-h-[62vh] w-full object-contain"
          />
          <button
            type="button"
            onClick={previousImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow-lg transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow-lg transition-colors hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="font-semibold text-slate-900">{selectedImage.title}</p>
            <p className="text-sm text-slate-500">Imagem em alta resolução: 1920 × 1280 px</p>
          </div>
          <div className="flex gap-2" aria-label="Selecionar foto da galeria">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`h-2.5 rounded-full transition-all ${index === selectedIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                aria-label={`Exibir foto ${index + 1}: ${image.title}`}
                aria-current={index === selectedIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
