import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface UsinaImage {
  src: string;
  alt: string;
  title: string;
  location: string;
  capacity: string;
  savings: string;
}

const usinaImages: UsinaImage[] = [
  {
    src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/residential-installation-DfxBVaAzHuL7tW6nVsCBrD.webp',
    alt: 'Usina Residencial 5kW',
    title: 'Usina Residencial 5kW',
    location: 'Belo Horizonte - MG',
    capacity: '5 kW',
    savings: 'R$ 450/mês'
  },
  {
    src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/commercial-solar-farm-nSnFepgr3tKZGu5qpD4kHT.webp',
    alt: 'Usina Comercial 10kW',
    title: 'Usina Comercial 10kW',
    location: 'Belo Horizonte - MG',
    capacity: '10 kW',
    savings: 'R$ 950/mês'
  },
  {
    src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/solar-panels-closeup-fhzVqa2w7QtrxtdEj9HQ3s.webp',
    alt: 'Usina Industrial 25kW',
    title: 'Usina Industrial 25kW',
    location: 'Belo Horizonte - MG',
    capacity: '25 kW',
    savings: 'R$ 2.500/mês'
  },
  {
    src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/hero-solar-panels-P8T8FYmLny5gbdJnA7NAeq.webp',
    alt: 'Usina Residencial 8kW',
    title: 'Usina Residencial 8kW',
    location: 'Belo Horizonte - MG',
    capacity: '8 kW',
    savings: 'R$ 680/mês'
  }
];

export default function GaleriaUsinas() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + usinaImages.length) % usinaImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % usinaImages.length);
    }
  };

  const selectedImage = selectedImageIndex !== null ? usinaImages[selectedImageIndex] : null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Fotos Reais de Nossas Usinas Instaladas
        </h3>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {usinaImages.map((image, index) => (
            <div
              key={index}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
              onClick={() => setSelectedImageIndex(index)}
            >
              <div className="relative overflow-hidden h-64 bg-gray-100">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-lg font-semibold">Clique para ampliar</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{image.title}</h4>
                <p className="text-sm text-gray-600 mb-2">📍 {image.location}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-semibold">Capacidade: {image.capacity}</span>
                  <span className="text-orange-600 font-semibold">Economia: {image.savings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && selectedImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
            <div className="relative max-w-4xl w-full">
              {/* Container da Imagem com Controles */}
              <div className="relative inline-block w-full">
                {/* Imagem */}
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto rounded-lg animate-fade-in"
                  style={{ maxHeight: '70vh' }}
                />

                {/* Botão Fechar - Lado Direito, 10 pt acima da seta direita */}
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute text-black hover:text-[#ff6900] transition-colors z-20"
                  style={{
                    right: '5px',
                    top: 'calc(50% - 60px)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={32} strokeWidth={3} />
                </button>

                {/* Seta Anterior - Lado Esquerdo */}
                <button
                  onClick={handlePrevious}
                  className="absolute text-black hover:text-[#ff6900] transition-colors z-20"
                  style={{
                    left: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronLeft size={32} strokeWidth={3} />
                </button>

                {/* Seta Próxima - Lado Direito */}
                <button
                  onClick={handleNext}
                  className="absolute text-black hover:text-[#ff6900] transition-colors z-20"
                  style={{
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ChevronRight size={32} strokeWidth={3} />
                </button>
              </div>

              {/* Legenda */}
              <div className="mt-6 text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-lg text-orange-400 font-semibold mb-2">{selectedImage.location}</p>
                <div className="flex justify-center gap-6 text-white">
                  <span>Capacidade: <strong>{selectedImage.capacity}</strong></span>
                  <span>Economia: <strong>{selectedImage.savings}</strong></span>
                </div>
                <p className="text-sm text-gray-400 mt-4">{selectedImageIndex + 1} de {usinaImages.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estilos de Animação */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}</style>
      </div>
    </section>
  );
}
