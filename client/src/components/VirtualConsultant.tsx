import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
}

export default function VirtualConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Olá! 👋 Bem-vindo à Bessa Energia. Como posso ajudá-lo hoje?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'Quanto posso economizar?',
    'Como funciona o financiamento?',
    'Solicitar orçamento',
    'Falar com especialista'
  ];

  const botResponses: { [key: string]: string } = {
    'quanto': 'Você pode economizar até 95% na sua conta de energia! Solicite um orçamento gratuito para saber exatamente quanto você pode poupar.',
    'financiamento': 'Oferecemos financiamento fácil e acessível. Você pode parcelar o investimento em sua usina solar sem comprometer seu orçamento.',
    'orçamento': 'Perfeito! Você pode preencher nosso formulário ou ligar para (31) 99102-9003. Nossos especialistas entrarão em contato em breve!',
    'especialista': 'Vou conectar você com um de nossos especialistas. Por favor, deixe seu telefone: (31) 99102-9003 ou preencha o formulário de contato.',
    'default': 'Obrigado pela sua pergunta! Para mais informações detalhadas, entre em contato conosco através do formulário ou ligue para (31) 99102-9003.'
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = botResponses.default;

      if (lowerInput.includes('quanto') || lowerInput.includes('economizar')) {
        response = botResponses.quanto;
      } else if (lowerInput.includes('financiamento') || lowerInput.includes('parcel')) {
        response = botResponses.financiamento;
      } else if (lowerInput.includes('orçamento') || lowerInput.includes('orcamento')) {
        response = botResponses.orçamento;
      } else if (lowerInput.includes('especialista') || lowerInput.includes('falar')) {
        response = botResponses.especialista;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickReply = (reply: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: reply
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const lowerInput = reply.toLowerCase();
      let response = botResponses.default;

      if (lowerInput.includes('quanto') || lowerInput.includes('economizar')) {
        response = botResponses.quanto;
      } else if (lowerInput.includes('financiamento') || lowerInput.includes('parcel')) {
        response = botResponses.financiamento;
      } else if (lowerInput.includes('orçamento') || lowerInput.includes('orcamento')) {
        response = botResponses.orçamento;
      } else if (lowerInput.includes('especialista') || lowerInput.includes('falar')) {
        response = botResponses.especialista;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl">
            <h3 className="font-bold text-lg">Consultor Virtual</h3>
            <p className="text-sm text-orange-100">Estamos aqui para ajudar!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              <p className="text-xs text-gray-500 font-semibold">Perguntas rápidas:</p>
              <div className="space-y-2">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
