import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  projectType: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Carlos Silva',
    location: 'Belo Horizonte - MG',
    rating: 5,
    text: 'Excelente trabalho! A equipe foi muito profissional e atenciosa. Minha conta de luz caiu 85% no primeiro mês. Recomendo muito!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/avatar-1-carlos.jpg',
    projectType: 'Residencial 5kW'
  },
  {
    id: 2,
    name: 'Fernanda Costa',
    location: 'Belo Horizonte - MG',
    rating: 5,
    text: 'Investimento que vale muito a pena! Já recuperei 30% do investimento em apenas 1 ano. Equipe muito competente!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/avatar-2-fernanda.jpg',
    projectType: 'Residencial 8kW'
  },
  {
    id: 3,
    name: 'João Oliveira',
    location: 'Belo Horizonte - MG',
    rating: 5,
    text: 'Instalação rápida e sem complicações. O atendimento pós-venda é impecável. Muito satisfeito com o resultado!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/avatar-3-joao.jpg',
    projectType: 'Comercial 10kW'
  },
  {
    id: 4,
    name: 'Patricia Mendes',
    location: 'Belo Horizonte - MG',
    rating: 5,
    text: 'Melhor decisão que tomei! A Bessa Energia ofereceu as melhores condições de financiamento. Recomendo para todos!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/avatar-4-patricia.jpg',
    projectType: 'Residencial 6kW'
  },
  {
    id: 5,
    name: 'Roberto Ferreira',
    location: 'Belo Horizonte - MG',
    rating: 5,
    text: 'Profissionalismo de primeira qualidade! Desde o orçamento até a instalação, tudo perfeito. Muito grato!',
    avatar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/avatar-5-roberto.jpg',
    projectType: 'Industrial 25kW'
  }
];

export default function ClientReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Confira os depoimentos de clientes satisfeitos que já transformaram suas contas de luz com energia solar
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Review Content */}
            <div className="text-center px-12">
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {currentReview.name.charAt(0)}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: currentReview.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-lg text-gray-700 mb-8 italic leading-relaxed">
                "{currentReview.text}"
              </p>

              {/* Client Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentReview.name}
                </h3>
                <p className="text-sm text-orange-500 font-semibold mb-2">
                  {currentReview.projectType}
                </p>
                <p className="text-gray-600">
                  📍 {currentReview.location}
                </p>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-orange-500 w-8'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Counter */}
          <div className="text-center mt-6 text-gray-600">
            <p className="text-sm">
              {currentIndex + 1} de {reviews.length}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              500+
            </div>
            <p className="text-gray-600">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              4.9★
            </div>
            <p className="text-gray-600">Avaliação Média</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              95%
            </div>
            <p className="text-gray-600">Economia Média</p>
          </div>
        </div>
      </div>
    </section>
  );
}
