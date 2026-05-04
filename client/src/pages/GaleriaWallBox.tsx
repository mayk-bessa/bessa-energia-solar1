import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export default function GaleriaWallBox() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = [
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/wallbox-pulsar-plus-61169483.jpg',
      alt: 'Wallbox Pulsar Plus',
      title: 'Wallbox Pulsar Plus',
      description: 'Carregador inteligente de alta potência'
    },
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/wallbox-solar-integration-0da93c84.jpg',
      alt: 'Integração Solar',
      title: 'Integração Solar',
      description: 'Wallbox conectado ao sistema solar'
    },
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/carport-solar-7837a09a.jpg',
      alt: 'Carport Solar',
      title: 'Carport Solar',
      description: 'Estacionamento com carregamento solar'
    },
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/ponto-recarga-ve-solar-344.jpg',
      alt: 'Ponto de Recarga de VE Solar',
      title: 'Ponto de Recarga de VE Solar',
      description: 'Infraestrutura de carregamento solar'
    },
    {
      src: '/manus-storage/carport_ddb7d756.jpeg',
      alt: 'Carport Solar Profissional',
      title: 'Carport Solar Profissional',
      description: 'Sistema completo de carregamento solar'
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
          <h1 className="text-4xl font-bold mb-4">WallBox - Carregador Inteligente</h1>
          <p className="text-xl text-blue-100">Soluções de carregamento solar para veículos elétricos</p>
        </div>
      </section>

      {/* Conceitos Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Entenda os Conceitos</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">WallBox</h3>
              <p className="text-gray-700 mb-4">
                Um carregador de veículos elétricos inteligente que se instala na parede. Oferece carregamento rápido e seguro, com potência de até 22kW. Ideal para residências e empresas.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Carregamento rápido</li>
                <li>✓ Inteligente e conectado</li>
                <li>✓ Seguro e confiável</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Carport Solar</h3>
              <p className="text-gray-700 mb-4">
                Uma estrutura de cobertura com painéis solares integrados que funciona como estacionamento. Gera energia limpa enquanto protege os veículos da chuva e sol.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Gera energia solar</li>
                <li>✓ Protege veículos</li>
                <li>✓ Estacionamento inteligente</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Ponto de Recarga VE</h3>
              <p className="text-gray-700 mb-4">
                Infraestrutura de carregamento para veículos elétricos. Pode ser um wallbox individual ou um carport com múltiplas estações de carregamento para frotas.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Infraestrutura completa</li>
                <li>✓ Para veículos elétricos</li>
                <li>✓ Escalável e modular</li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-4 text-left">Característica</th>
                  <th className="p-4 text-left">WallBox</th>
                  <th className="p-4 text-left">Carport Solar</th>
                  <th className="p-4 text-left">Ponto de Recarga VE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Gera Energia</td>
                  <td className="p-4">Não</td>
                  <td className="p-4">Sim</td>
                  <td className="p-4">Depende</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Protege Veículo</td>
                  <td className="p-4">Não</td>
                  <td className="p-4">Sim</td>
                  <td className="p-4">Depende</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-semibold">Potência</td>
                  <td className="p-4">Até 22kW</td>
                  <td className="p-4">Variável</td>
                  <td className="p-4">Variável</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Instalação</td>
                  <td className="p-4">Parede</td>
                  <td className="p-4">Estrutura</td>
                  <td className="p-4">Flexível</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galeria de Projetos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="relative overflow-hidden h-80">
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
