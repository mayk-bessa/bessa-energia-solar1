import { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
    visitDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
      setErrors({ submit: `Erro ao enviar: ${error.message}` });
      setIsSubmitting(false);
    }
  });

  // Formata o telefone enquanto o usuário digita
  const formatPhoneNumber = (value: string): string => {
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limited = cleaned.slice(0, 11);
    
    // Formata como (99) 999999-9999
    if (limited.length === 0) return '';
    if (limited.length <= 2) return `(${limited}`;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 8)}-${limited.slice(8)}`;
  };

  // Valida o formato do telefone
  const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11; // DDD (2) + 9 dígitos
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      // Limpar erro de telefone se o usuário começar a digitar
      if (errors.phone) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Limpar erro do campo
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone deve ter formato (99) 999999-9999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendBudgetRequest.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        recipientEmail: 'vendas@bessaenergia.com.br'
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', phone: '', visitDate: '' });
    setErrors({});
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
              {/* Erro Geral */}
              {errors.submit && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              )}

              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone (Celular) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(31) 999999-9999"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: (DDD) 999999-9999
                </p>
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
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
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
