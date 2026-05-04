import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

export default function GaleriaWallBox() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const images = [
    {
      src: '/manus-storage/Jg2RMUES7eYD_61169483.jpg',
      alt: 'Wallbox Pulsar Plus',
      title: 'Wallbox Pulsar Plus',
      description: 'Carregador inteligente de alta potência'
    },
    {
      src: '/manus-storage/lxYPE647fL7H_0da93c84.jpg',
      alt: 'Integração Solar',
      title: 'Integração Solar',
      description: 'Wallbox conectado ao sistema solar'
    },
    {
      src: '/manus-storage/Udy7cfQuAh7N_b63b45f2.png',
      alt: 'Carport Solar Profissional',
      title: 'Carport Solar Profissional',
      description: 'Sistema completo de carregamento solar'
    },
    {
      src: '/manus-storage/oLceu0RoRFBv_7837a09a.jpg',
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

      {/* Concepts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Conceitos Principais</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">WallBox</h3>
              <p className="text-gray-700 mb-4">
                Um carregador de veículos elétricos instalado na parede que oferece carregamento rápido e inteligente. Pode ser integrado a sistemas solares para maximizar o uso de energia renovável.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Carregamento até 22kW</li>
                <li>✓ Instalação em parede</li>
                <li>✓ Inteligente e conectado</li>
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
          <div className="relative w-full max-w-4xl">
            {/* Container da Imagem com Controles */}
            <div className="relative">
              {/* Imagem */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-lg animate-fade-in"
              />

              {/* Botão Fechar (X) - Lado direito, 10 pt acima da seta, 5 pt dentro */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute text-white hover:text-[#ff6900] transition-colors z-50"
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

              {/* Seta Anterior - Lado esquerdo, 5 pt dentro */}
              <button
                onClick={handlePrevious}
                className="absolute text-white hover:text-[#ff6900] transition-colors z-50"
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
                <ChevronLeft size={40} strokeWidth={3} />
              </button>

              {/* Seta Próxima - Lado direito, 5 pt dentro, mesma altura da seta anterior */}
              <button
                onClick={handleNext}
                className="absolute text-white hover:text-[#ff6900] transition-colors z-50"
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
                <ChevronRight size={40} strokeWidth={3} />
              </button>
            </div>

            {/* Legenda abaixo da imagem */}
            <div className="mt-6 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
              <p className="text-lg text-[#ff6900] font-semibold">{selectedImage.description}</p>
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
