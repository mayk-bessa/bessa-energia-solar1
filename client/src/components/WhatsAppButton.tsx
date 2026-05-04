import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '5531991029003'; // Número real da Bessa Energia
  const message = 'Olá! Gostaria de saber mais sobre os serviços de energia solar da Bessa Energia.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      title="Enviar mensagem via WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}
