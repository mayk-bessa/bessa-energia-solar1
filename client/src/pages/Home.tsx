import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Sun, Shield, Home as HomeIcon, ArrowRight, Check } from 'lucide-react';
import VirtualConsultant from '@/components/VirtualConsultant';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cemiValue: '',
    message: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert(`Obrigado ${formData.name}! Entraremos em contato em breve!`);
    setFormData({ name: '', phone: '', cemiValue: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/Logotransparente_a105934c.PNG" 
              alt="Bessa Energia Logo"
              className="h-20 w-auto"
            />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Solicitar Orçamento
          </Button>
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
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                  Solicitar Orçamento
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg">
                  Tenha Dúvidas Como?
                </Button>
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
                Rei / us, banastre com quense sendo consumo x tabos av ciemos, vetor energia em contrat econômique teos-quiche-na.
              </p>

              <div className="space-y-6">
                {/* Benefit 1 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Economia Real</h3>
                    <p className="text-gray-600">
                      Mogul lobo intímicos munche fies e agora ocommentum com seu econômenta.
                    </p>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Financiamento Fácil</h3>
                    <p className="text-gray-600">
                      Amortização onilich, disponibilivele na subscrição - ao mancamento-prito ao pacto o banccomecida nepriticidos.
                    </p>
                  </div>
                </div>

                {/* Benefit 3 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Valorização Imobiliária</h3>
                    <p className="text-gray-600">
                      Udia ni comim e vicancação atgon antiolamentia - Prato laraze na imobilia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-6">
                <p className="text-sm text-orange-100 mb-2">RIVFALE ROTIA BILIES DES</p>
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

              <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold py-3">
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
            {/* Card 1 */}
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

            {/* Card 2 */}
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

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663417025632/3WeEs8oW3WFUxiz2LNTEV2/solar-panels-closeup-fhzVqa2w7QtrxtdEj9HQ3s.webp"
                alt="Usina Solar em IH"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Usina Solar em IH</h3>
                  <p className="text-sm text-orange-300">Tecnologia de ponta em energia limpa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
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

            {/* Form */}
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
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-lg"
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
            {/* Company Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">A Empresa</h3>
              <p className="text-sm leading-relaxed">
                Líderprofissional comercial para todas categorias. Especialização em energia solar, tecnologia renovável, sustentabilidade e consultoria energética.
              </p>
            </div>

            {/* Contact Info */}
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

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <p className="text-sm">
                IC 3838, Situs Cia 07 / Frazzado 986. <br />
                Cia Hoches Caia, Alagão
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2024 Bessa Energia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Virtual Consultant */}
      <VirtualConsultant />
    </div>
  );
}
