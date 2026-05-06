import { useState, useRef } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Sun, Shield, Home as HomeIcon, Upload, FileText, Trash2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { Link } from 'wouter';
import VirtualConsultant, { VirtualConsultantHandle } from '@/components/VirtualConsultant';
import BudgetRequestModal from '@/components/BudgetRequestModal';
import SolarCalculatorModal from '@/components/SolarCalculatorModal';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const consultantRef = useRef<VirtualConsultantHandle>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cemiValue: '',
    message: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Obrigado ${formData.name}! Entraremos em contato em breve!`);
    setFormData({ name: '', phone: '', cemiValue: '', message: '' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || !isAuthenticated) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/trpc/files.upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result?.data) {
            setUploadedFiles(prev => [...prev, {
              name: file.name,
              url: data.result.data.url
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/Logotransparente_bessaenergia_cores.png" 
              alt="Bessa Energia Logo"
              className="h-20 w-auto" style={{width: '251px', height: '116px'}}
            />
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="text-sm text-gray-600">
                Olá, {user?.name || 'Usuário'}
              </div>
            ) : null}
            <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white" style={{backgroundColor: '#ff6900'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff5500'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6900'}>
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/hero-solar-panels-P8T8FYmLny5gbdJnA7NAeq.webp)',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-transparent to-orange-900/50"></div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Poupe até <span className="text-orange-400">95%</span> na sua conta da Cemig!
              </h2>
              <p className="text-lg text-gray-100 mb-8">
                Tecnologia de ponta em energia fotovoltaica para a sua casa ou empresa. Solicite um orçamento gratuito e faça parte da energia solar!
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button onClick={() => setIsBudgetModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff5500'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6900'}>
                  Solicitar Orçamento
                </Button>
                <Button onClick={() => consultantRef.current?.open()} className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg" style={{width: '234px', backgroundColor: '#253c7e'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2d5f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#253c7e'}>
                  Tire suas Dúvidas
                </Button>
                <Link href="/calculadora-avancada">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg" style={{backgroundColor: '#253c7e', width: '234px'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2d5f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#253c7e'}>
                    Calculadora Avançada
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg" style={{width: '234px', backgroundColor: '#253c7e'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a2d5f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#253c7e'}>
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Economia Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Veja quanto você pode economizar
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Nossos especialistas vão analisar o seu cenário e o seu consumo para criar a melhor configuração.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Economia Real</h3>
                    <p className="text-gray-600">
                      Pague apenas a taxa mínima da Cemig e use o que poupar para realizar os seus sonhos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Financiamento Fácil</h3>
                    <p className="text-gray-600">
                      A prestação substitui a sua conta de luz. Em poucos anos o sistema está pago e o lucro é seu.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Valorização Imobiliária</h3>
                    <p className="text-gray-600">
                      Um imóvel com energia solar valoriza-se instantaneamente no mercado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl" style={{opacity: '0.9'}}>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <p className="text-sm text-orange-100 mb-2">Simulador de Geração</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-4xl font-bold">R$ 520</p>
                    <p className="text-sm text-orange-100">Economia mensal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">95%</p>
                    <p className="text-sm text-orange-100">Redução</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-white rounded-full"></div>
                </div>
              </div>

              <Button onClick={() => setIsCalculatorModalOpen(true)} className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold py-3">
                Ver Detalhes do Projeto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Installations Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Nossas Instalações em BH
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/residential-installation-DfxBVaAzHuL7tW6nVsCBrD.webp"
                alt="Obra Residencial"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Obra Residencial</h3>
                  <p className="text-sm text-orange-300">Instalação profissional em residências</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/commercial-solar-farm-nSnFepgr3tKZGu5qpD4kHT.webp"
                alt="Equipe Especializada"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Equipe Especializada</h3>
                  <p className="text-sm text-orange-300">Profissionais certificados e experientes</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/solar-panels-closeup-fhzVqa2w7QtrxtdEj9HQ3s.webp"
                alt="Usina Solar em IH"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Usina Solar em BH</h3>
                  <p className="text-sm text-orange-300">Tecnologia de ponta em energia limpa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/galeria-instalacoes">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Ver Galeria Completa
              </Button>
            </Link>
          </div>

          {/* WallBox Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
              WallBox - Carregador Inteligente
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
              Um wallbox é um carregador de veículos elétricos inteligente e de alta potência que se instala na parede de sua casa ou empresa. Quando integrado a um sistema solar, permite que você carregue seu carro com energia 100% limpa e renovável, reduzindo custos e impacto ambiental.
            </p>

            {/* Advantages Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">⚡</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Carregamento Rápido</h3>
                <p className="text-sm text-gray-700">Carregue seu veículo em poucas horas com potências de até 22kW</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">🌱</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Limpo</h3>
                <p className="text-sm text-gray-700">Energia renovável dos painéis solares, zero emissões de carbono</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">💰</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Economia Garantida</h3>
                <p className="text-sm text-gray-700">Reduza seus gastos com combustível e energia elétrica</p>
              </div>
            </div>

            {/* Images Grid - Full Width Responsive */}
            {/* Wallbox Pulsar Plus - Full Width */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6">
              <img
                src="/manus-storage/Jg2RMUES7eYD_61169483.jpg"
                alt="Wallbox Pulsar Plus"
                className="w-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-100"
                style={{ height: 'auto', maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Wallbox Pulsar Plus</h3>
                  <p className="text-sm text-orange-300">Carregador inteligente de alta potência</p>
                </div>
              </div>
            </div>

            {/* Integração Solar - Full Width */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6">
              <img
                src="/manus-storage/lxYPE647fL7H_0da93c84.jpg"
                alt="Wallbox com Painéis Solares"
                className="w-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-100"
                style={{ height: 'auto', maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Integração Solar</h3>
                  <p className="text-sm text-orange-300">Wallbox conectado ao sistema solar</p>
                </div>
              </div>
            </div>

            {/* Carport Solar - Full Width */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6">
              <img
                src="/manus-storage/Udy7cfQuAh7N_b63b45f2.png"
                alt="Carport Solar com Carro Elétrico"
                className="w-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-100"
                style={{ height: 'auto', maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Carport Solar</h3>
                  <p className="text-sm text-orange-300">Estacionamento com carregamento solar</p>
                </div>
              </div>
            </div>

            {/* Estacionamento com carregamento solar - Full Width */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-6">
              <img
                src="/manus-storage/oLceu0RoRFBv_7837a09a.jpg"
                alt="Estacionamento com Carregamento Solar"
                className="w-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-100"
                style={{ height: 'auto', maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Ponto de Recarga de VE Solar</h3>
                  <p className="text-sm text-orange-300">Estacionamento com carregamento solar</p>
                </div>
              </div>
            </div>

            {/* Carport Section */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src="/manus-storage/carport_ddb7d756.jpeg"
                alt="Carport Solar Profissional"
                className="w-full object-contain group-hover:scale-110 transition-transform duration-300 bg-gray-100"
                style={{ height: 'auto', maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Carport Solar Profissional</h3>
                  <p className="text-sm text-orange-300">Sistema completo de carregamento solar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/galeria-wallbox">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Ver Galeria Completa WallBox
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* File Upload Section (Only for authenticated users) */}
      {isAuthenticated && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Gerenciador de Arquivos
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Fazer Upload</h3>
                
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-orange-400 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-orange-500 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste arquivos
                    </p>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOC, IMG até 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>

                {isUploading && (
                  <div className="mt-4 text-center text-orange-600">
                    Enviando arquivos...
                  </div>
                )}
              </div>

              {/* Files List */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Arquivos Enviados</h3>
                
                {uploadedFiles.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum arquivo enviado ainda</p>
                ) : (
                  <div className="space-y-3">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-orange-500" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 text-sm font-semibold"
                        >
                          Abrir
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">
                Solicite o seu Projeto <span className="text-orange-400">Grátis</span>
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Preenha o formulário e solicite um orçamento gratuito para instalação dos seus painéis solares sem compromisso!
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <span className="text-lg">(31) 99102-9003</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <span className="text-lg">contato@bessaenergia.com.br</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Nome"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Telefone"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  name="cemiValue"
                  value={formData.cemiValue}
                  onChange={handleFormChange}
                  placeholder="Valor da Cemig"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Mensagem (opcional)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors resize-none"
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg" style={{backgroundColor: '#ff6900'}}
                >
                  Receber Orçamento
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">A Empresa</h3>
              <p className="text-sm leading-relaxed">
                Líder profissional comercial para todas categorias. Especialização em energia solar, tecnologia renovável, sustentabilidade e consultoria energética.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Contato</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>(31) 9 9102-9003</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>contato@bessaenergia.com.br</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>Rua Vaga 241 Bairro Savassi, Belo Horizonte</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <p className="text-sm">
                Todos os direitos reservados Bessa Tecnologia & Energia.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2024 Bessa Energia. Todos os direitos reservados.
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Desenvolvido com ❤️ pela Bessa Tecnologia
            </p>
          </div>
        </div>
      </footer>

      <BudgetRequestModal 
        isOpen={isBudgetModalOpen} 
        onClose={() => setIsBudgetModalOpen(false)} 
      />
      <SolarCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />
      <VirtualConsultant ref={consultantRef} />
    </div>
  );
}
