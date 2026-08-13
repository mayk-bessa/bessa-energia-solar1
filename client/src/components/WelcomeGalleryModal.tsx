import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type WelcomeGalleryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const galleryImages = [
  {
    src: '/images/wallbox/wallbox-pulsar-plus.webp',
    alt: 'Wallbox Pulsar Plus instalado em ambiente residencial',
    title: 'Wallbox Pulsar Plus',
    description: 'Carregamento inteligente para veículos elétricos em projetos residenciais modernos.',
  },
  {
    src: '/images/wallbox/wallbox-paineis-solares.webp',
    alt: 'Wallbox integrado a painéis solares',
    title: 'Integração Solar',
    description: 'Painéis solares e mobilidade elétrica trabalhando juntos para reduzir custos.',
  },
  {
    src: '/images/wallbox/carport-carro-eletrico.webp',
    alt: 'Carport solar com carro elétrico',
    title: 'Carport Solar',
    description: 'Estrutura que une sombreamento, geração fotovoltaica e recarga veicular.',
  },
  {
    src: '/images/wallbox/estacionamento-carregamento-solar.webp',
    alt: 'Estacionamento com carregamento solar',
    title: 'Mobilidade Elétrica',
    description: 'Recarga sustentável para veículos elétricos em estacionamentos e empresas.',
  },
  {
    src: '/images/wallbox/carport-solar-profissional.webp',
    alt: 'Carport solar profissional com carregador veicular',
    title: 'Projeto Profissional',
    description: 'Solução completa para geração solar e infraestrutura de recarga.',
  },
  {
    src: '/images/galeria/reajustes-tarifarios-solar.jpg',
    alt: 'Arte informativa sobre reajustes tarifários e energia solar',
    title: 'Proteção contra reajustes',
    description: 'A energia solar ajuda a reduzir a exposição às altas tarifárias com uma solução de longo prazo.',
  },
  {
    src: '/images/galeria/condicoes-pagamento-solar.jpg',
    alt: 'Arte sobre condições especiais de pagamento para energia solar',
    title: 'Condições de pagamento',
    description: 'Opções facilitadas para transformar seu projeto de energia solar em realidade.',
  },
  {
    src: '/images/galeria/economia-previsibilidade-solar.jpg',
    alt: 'Arte sobre economia e previsibilidade com energia solar',
    title: 'Economia com previsibilidade',
    description: 'Faça uma simulação e construa uma alternativa duradoura diante da elevação das tarifas.',
  },
];

export default function WelcomeGalleryModal({ isOpen, onClose }: WelcomeGalleryModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (isFullscreen) {
        setIsFullscreen(false);
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', handleEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isFullscreen, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setIsFullscreen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedImage = galleryImages[selectedIndex];
  const previousImage = () => setSelectedIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setSelectedIndex((index) => (index + 1) % galleryImages.length);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-gallery-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <motion.div
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 16, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, delay: 0.06, ease: 'easeOut' }}
      >
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
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-orange-500"
            aria-label={`Abrir ${selectedImage.title} em tela cheia`}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1920}
              height={1280}
              className="h-auto max-h-[62vh] w-full object-contain"
            />
          </button>
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
            <p className="text-sm text-slate-500">{selectedImage.description}</p>
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
      </motion.div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Visualização em tela cheia: ${selectedImage.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/95 p-3 text-slate-800 shadow-lg transition-[transform,background-color,color] duration-200 ease-out hover:scale-105 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 sm:right-7 sm:top-7"
              aria-label="Fechar tela cheia"
            >
              <X className="h-7 w-7" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="group flex h-full w-full cursor-zoom-out items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400"
              aria-label="Retornar ao tamanho original"
            >
              <motion.img
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1920}
                height={1280}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              />
            </button>

            <p className="pointer-events-none absolute bottom-5 rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-white sm:bottom-7">
              Clique na imagem para retornar ao tamanho original
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
