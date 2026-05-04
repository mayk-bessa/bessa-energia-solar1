import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'wouter';

export default function GaleriaWallBox() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          <h2 className="text-3xl font-bold text-center mb-12">Entenda as Diferenças</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* WallBox */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">WallBox</h3>
              <p className="text-gray-700 mb-4">
                Um carregador de veículos elétricos inteligente e de alta potência que se instala na parede de sua casa ou empresa.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Características:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Potência até 22kW</li>
                  <li>✓ Instalação em parede</li>
                  <li>✓ Controle inteligente</li>
                  <li>✓ Compatível com painéis solares</li>
                </ul>
              </div>
            </div>

            {/* Carport Solar */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🅿️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Carport Solar</h3>
              <p className="text-gray-700 mb-4">
                Uma estrutura de estacionamento coberta com painéis solares, gerando energia enquanto protege o veículo.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Características:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Cobertura com painéis</li>
                  <li>✓ Proteção do veículo</li>
                  <li>✓ Geração de energia</li>
                  <li>✓ Múltiplas vagas</li>
                </ul>
              </div>
            </div>

            {/* Ponto de Recarga */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">🔌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ponto de Recarga</h3>
              <p className="text-gray-700 mb-4">
                Uma estação de carregamento para veículos elétricos, que pode ser alimentada por energia solar ou da rede.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Características:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Carregamento rápido</li>
                  <li>✓ Flexível de instalação</li>
                  <li>✓ Fonte de energia variável</li>
                  <li>✓ Uso público ou privado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="border border-gray-300 p-4 text-left">Característica</th>
                  <th className="border border-gray-300 p-4 text-center">WallBox</th>
                  <th className="border border-gray-300 p-4 text-center">Carport Solar</th>
                  <th className="border border-gray-300 p-4 text-center">Ponto de Recarga</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4 font-semibold">Instalação</td>
                  <td className="border border-gray-300 p-4 text-center">Parede</td>
                  <td className="border border-gray-300 p-4 text-center">Estrutura</td>
                  <td className="border border-gray-300 p-4 text-center">Flexível</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="border border-gray-300 p-4 font-semibold">Potência Máxima</td>
                  <td className="border border-gray-300 p-4 text-center">22kW</td>
                  <td className="border border-gray-300 p-4 text-center">Variável</td>
                  <td className="border border-gray-300 p-4 text-center">Variável</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4 font-semibold">Proteção</td>
                  <td className="border border-gray-300 p-4 text-center">Não</td>
                  <td className="border border-gray-300 p-4 text-center">Sim</td>
                  <td className="border border-gray-300 p-4 text-center">Não</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-gray-50">
                  <td className="border border-gray-300 p-4 font-semibold">Geração Solar</td>
                  <td className="border border-gray-300 p-4 text-center">Opcional</td>
                  <td className="border border-gray-300 p-4 text-center">Integrada</td>
                  <td className="border border-gray-300 p-4 text-center">Opcional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Galeria de Projetos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedImage(image.src)}
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
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-orange-500 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
