import { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

interface BudgetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BudgetRequestModal({ isOpen, onClose }: BudgetRequestModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ddd: '31',
    visitDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendBudgetRequest = trpc.budget.sendRequest.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    },
    onError: (error) => {
      alert(`Erro ao enviar: ${error.message}`);
      setIsSubmitting(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      alert('Por favor, insira seu nome completo');
      return;
    }
    if (!formData.email.trim()) {
      alert('Por favor, insira seu email');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Por favor, insira seu telefone');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendBudgetRequest.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: `(${formData.ddd}) ${formData.phone}`,
        recipientEmail: 'vendas@bessaenergia.com.br'
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', phone: '', ddd: '31', visitDate: '' });
    setIsSuccess(false);
    setIsSubmitting(false);
    onClose();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in scale-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Solicitar Orçamento</h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-orange-700 p-1 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sucesso!</h3>
              <p className="text-gray-600">
                Sua solicitação foi enviada com sucesso. Entraremos em contato em breve!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Telefone com DDD */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DDD
                  </label>
                  <input
                    type="text"
                    name="ddd"
                    value={formData.ddd}
                    onChange={handleChange}
                    placeholder="31"
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Data de Visita Técnica */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agendar Visita Técnica (Opcional)
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Disponível para os próximos 90 dias. Deixe em branco para não agendar agora.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitação'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Seus dados serão enviados para vendas@bessaenergia.com.br
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
