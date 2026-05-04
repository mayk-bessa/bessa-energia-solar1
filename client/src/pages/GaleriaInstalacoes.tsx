import { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'wouter';

export default function GaleriaInstalacoes() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/instalacao-residencial-BH.webp',
      alt: 'Instalação Residencial em BH',
      title: 'Instalação Residencial',
      description: 'Sistema solar residencial de 5kW instalado em Belo Horizonte'
    },
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/usina-solar-comercial-BH.webp',
      alt: 'Usina Solar Comercial em BH',
      title: 'Usina Solar Comercial',
      description: 'Sistema solar comercial de 50kW para empresa em Belo Horizonte'
    },
    {
      src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/paineis-solares-closeup.webp',
      alt: 'Painéis Solares Close-up',
      title: 'Painéis Solares de Alta Eficiência',
      description: 'Painéis solares monocristalinos de última geração com eficiência de 22%'
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
                onClick={() => setSelectedImage(image.src)}
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
