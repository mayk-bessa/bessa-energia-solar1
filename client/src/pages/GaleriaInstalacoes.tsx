import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export default function GaleriaInstalacoes() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  const handlePrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center cursor-pointer">
            <img 
              src="/Logotransparente_bessaenergia_cores.png" 
              alt="Bessa Energia Logo"
              className="h-20 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-orange-500 cursor-pointer">
              Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Nossas Instalações em BH</h1>
          <p className="text-xl text-blue-100">Conheça os projetos solares realizados em Belo Horizonte</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="relative overflow-hidden h-64">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h3>
                  <p className="text-gray-600">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full">
            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors z-10"
            >
              <X size={32} />
            </button>

            {/* Seta Anterior */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 text-white hover:text-orange-500 transition-colors"
            >
              <ChevronLeft size={40} />
            </button>

            {/* Seta Próxima */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-white hover:text-orange-500 transition-colors"
            >
              <ChevronRight size={40} />
            </button>

            {/* Imagem */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg animate-fade-in"
            />

            {/* Legenda */}
            <div className="mt-6 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-lg text-orange-500">{selectedImage.description}</p>
              <p className="text-sm text-gray-400 mt-4">{selectedImageIndex + 1} de {images.length}</p>
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
  );
}
