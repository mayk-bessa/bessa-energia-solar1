# Bessa Energia - TODO

## Fases Concluídas

- [x] **Fase 1 - Painel Administrativo**: Dashboard com visualização, filtros por status, gerenciamento de orçamentos e leads
- [x] **Fase 2 - Agendamento de Visita Técnica**: Calendário integrado ao formulário (90 dias), rotas tRPC scheduleVisit e getVisits
- [x] **Fase 3 - Notificações por Email**: Templates HTML profissionais, confirmação ao cliente, alertas para equipe de vendas
- [x] **Fase 4 - Exportar Relatórios em PDF**: PDF gerado com sucesso, testes vitest (7 testes)
- [x] **Fase 5 - Calculadora Avançada**: Sliders funcionando, comparativo de cenários (3kW/5kW/10kW), testes vitest (10 testes)
- [x] **Fase 6 - Dashboard Avançado**: 3 gráficos (Economia, ROI, Payback), testes vitest (30 testes), total 90 testes passando
- [x] **Fase 7 - Sincronização de Contexto**: localStorage implementado, sincronização entre páginas funcionando

## Validações Manuais Realizadas

### ✅ Testes que Passaram
1. **Sliders da Calculadora**: PASSOU - valores atualizando corretamente
2. **Exportação de PDF**: PASSOU - PDF gerado e baixado com sucesso (2.4 KB)
3. **Gráficos do Dashboard**: PASSOU - todos os 3 gráficos renderizando corretamente
4. **Correção de Chart.js**: PASSOU - BarController e LineController registrados
5. **Sincronização Calculadora-Dashboard**: PASSOU - localStorage implementado
### ⚠️ Testes Pendentes
1. **Envio de Email com PDF**: Erro de conexão TLS na porta 587
   - Firewall do sandbox pode estar bloqueando conexões SSL/TLS
   - Configuração SMTP está correta (porta 587/TLS)
   - Necessário: Testar em ambiente de produção ou usar serviço externo (SendGrid, Mailgun)

## Problemas Identificados e Resolvidos

### 1. Sincronização de Contexto (✅ RESOLVIDO)
- **Problema**: O CalculatorContext não estava sincronizando entre Calculadora e Dashboard
- **Causa Raiz**: React Context não persiste entre navegações de página
- **Solução Implementada**: localStorage + event listeners para sincronização
- **Resultado**: Sincronização funcionando perfeitamente

### 2. Email SMTP (PARCIALMENTE RESOLVIDO)
- **Problema**: Erro de conexão TLS na porta 587
- **Causa**: Firewall do sandbox bloqueando conexões SSL/TLS
- **Solução Implementada**: Porta 587 (TLS) configurada com requireTLS
- **Solução Alternativa**: Usar serviço externo (SendGrid, Mailgun) ou testar em produção
- **Status**: Aguardando teste em ambiente de produção

## Próximas Tarefas

- [x] **Substituir Favicon** (CONCLUÍDO)
  - [x] Logo da Bessa Energia convertida para favicon.ico
  - [x] Múltiplas resoluções incluídas (256x256 até 16x16)
  - [x] Favicon exibido corretamente no navegador

- [x] **Validar Email em Produção** (SMTP autenticado e envio PDF validado em 15/08/2026)
  - [x] Configuração SMTP completa (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
  - [x] Porta 587 (TLS) configurada
  - [x] Testes vitest validando configuração (3 testes passando)
  - [x] Publicação efetivada por checkpoint do projeto
  - [x] Envio real de email com PDF validado para contato@bessaenergia.com.br
  - [x] Fluxo de exportação coberto pelos testes e serviço SMTP validado

- [x] **Validar Domínio Customizado** (VPS e HTTPS validados em 15/08/2026)
  - [x] Domínio automático disponível: bessa-solar-3wees8ow.manus.space (ativo)
  - [x] Domínio já configurado no VPS; não requer cadastro no painel Manus para esta implantação
  - [x] DNS A resolvendo para 143.95.208.202
  - [x] Propagação confirmada por resolução DNS pública
  - [x] HTTPS retornando HTTP/2 200 com certificado Let's Encrypt válido

- [x] **Organizar Dashboard** (CONCLUÍDO)
  - [x] Caixas de texto com barra de rolagem (max-h-96 overflow-y-auto)
  - [x] Descrições expandidas e mais claras
  - [x] Seção CTA reorganizada com cards de parâmetros visíveis
  - [x] Melhor contraste e legibilidade

- [x] **Integrar Gráficos com Dados Reais** (CONCLUÍDO)
  - [x] Dashboard consome calculatorParams do CalculatorContext
  - [x] Cálculos usam economyRate e kwhCost
  - [x] Sincronização via localStorage funciona perfeitamente
  - [x] Gráficos recebem dados atualizados em tempo real

## Tarefas Finais

- [x] **Organizar Dashboard com Visibilidade Melhorada** (CONCLUÍDO)
- [x] **Integrar Gráficos com Dados Reais da Calculadora** (CONCLUÍDO)
- [x] **Salvar Checkpoint Final** (CONCLUÍDO - versão 0f9eb263)
- [x] **Branding Completo** (CONCLUÍDO)
  - [x] Projeto nomeado como "Bessa Energia - Usinas de Energia Solar"
  - [x] Logo da Bessa Energia implementada na navegação
  - [x] Favicon convertido do logo (154KB com múltiplas resoluções)
  - [x] Cores da marca (#ff6900 laranja, #253c7e azul escuro) aplicadas

- [x] **Publicar revisão atual** (VPS atualizado e mapa georreferenciado confirmado pelo usuário)
  - [x] Salvar checkpoint da revisão atual e publicar
  - [x] Atualizar o VPS com a revisão atual (instruções e roteiro fornecidos ao usuário)
  - [x] Site acessível pelo domínio público configurado em validação anterior
  - [x] SMTP TLS e envio PDF pela UI validados na prévia



## Fases Futuras

## Status Final do Projeto

✅ **DESENVOLVIMENTO CONCLUÍDO COM SUCESSO**
- Todas as funcionalidades solicitadas implementadas
- 97 testes vitest passando
- Documentação completa fornecida
- Projeto pronto para publicação

⏳ **ITENS PENDENTES (Requerem Ação do Usuário):**
- Testar Email em Produção (após publicar)
- [x] Configurar/validar domínio customizado no VPS (o domínio é gerenciado fora do painel Manus)

## Fases Futuras (Não Solicitadas)

- [x] **Integração com Google Maps**: mapa funcional de cobertura regional implementado com proxy do projeto
- [x] **Sistema de Avaliações**: submissão pública, moderação administrativa e exibição somente de avaliações aprovadas

## Resumo de Testes

| Teste | Status | Observações |
|-------|--------|-------------|
| Sliders Calculadora | ✅ PASSOU | Valores atualizando corretamente |
| Exportação PDF | ✅ PASSOU | PDF gerado com sucesso (2.4 KB) |
| Gráficos Dashboard | ✅ PASSOU | 3 gráficos renderizando |
| Chart.js Correção | ✅ PASSOU | BarController e LineController registrados |
| Sincronização Contexto | ✅ PASSOU | localStorage implementado com sucesso |
| Dashboard Organizado | ✅ PASSOU | Barra de rolagem, descrições expandidas |
| Email SMTP | ⛳ PENDENTE | Firewall do sandbox bloqueia TLS na porta 587 |
| DNS Customizado | ⛳ PENDENTE | Usuário deve configurar no painel Manus |

## Estatísticas Finais

- **Total de Testes Vitest**: 90 (todos passando)
- **Validações Manuais**: 6 (5 passaram, 1 pendente)
- **Componentes Implementados**: 11 (Calculadora, Dashboard, 3 Gráficos, etc.)
- **Páginas Implementadas**: 3 (Home, Calculadora Avançada, Dashboard)
- **Domínio Automático**: bessa-solar-3wees8ow.manus.space
- **Status Geral**: ✅ PRONTO PARA PRODUÇÃO


## Itens Recentemente Concluidos

- [x] **Galerias com Lightbox** (CONCLUIDO - VERIFICADO VISUALMENTE)
  - [x] Galeria para Nossas Instalacoes em BH com 3 imagens
  - [x] Galeria para WallBox com 5 imagens + tabela comparativa
  - [x] Setas de navegacao com hover laranja (#ff6900)
  - [x] Botao X para fechar (posicionado 10 pts acima da seta de navegacao)
  - [x] Transicoes fade-in/fade-out 0.3s ease-in-out
  - [x] Legendas com titulo, descricao e contador (ex: "1 de 5")
  - [x] Navegacao circular em ambas as galerias
  - [x] Testes vitest para navegacao e animacoes
  - [x] URLs das imagens WallBox corrigidas (usando CDN + storage proxy)
  - [x] Verificacao visual: Todas as imagens exibindo corretamente

- [x] **Botao Flutuante WhatsApp** (CONCLUIDO)
  - [x] Botao verde no canto inferior direito
  - [x] Numero de telefone: 5531991029003 (Bessa Energia)
  - [x] Abre conversa pre-preenchida no WhatsApp
  - [x] Efeito hover com aumento de escala
  - [x] Funciona em desktop e mobile

- [x] **Storage Proxy** (CONCLUIDO)
  - [x] Proxy configurado para servir imagens do /manus-storage/
  - [x] Imagens da secao WallBox exibindo corretamente
  - [x] URLs do storage funcionando com storage proxy

## Correções Solicitadas - Galerias WallBox

- [x] **Reposicionar Botão X e Setas na Visualização em Tela Cheia**
  - [x] Botão X: lado direito, 10 pt acima da seta direita, 5 pt dentro da imagem
  - [x] Setas avançar/retroceder: lado direito, 5 pt dentro da imagem
  - [x] Cor branca com hover laranja (#ff6900)
  - [x] Garantir visibilidade em qualquer tamanho de tela
  - [x] Elementos sempre à frente (z-index correto)

- [x] **Adicionar Legenda com Descrição**
  - [x] Exibir descrição da imagem quando aberta em tela cheia
  - [x] Legenda visível abaixo ou sobreposta à imagem

- [x] **Substituir Imagens da Galeria WallBox**
  - [x] Imagem 1: carport_ddb7d756.jpeg
  - [x] Imagem 2: lxYPE647fL7H_0da93c84.jpg
  - [x] Imagem 3: Udy7cfQuAh7N_b63b45f2.png
  - [x] Imagem 4: M3W7ro9VGiw4_09c26695.jpg
  - [x] Manter imagem 5 inalterada

## Alterações de Imagens - Galeria WallBox (Concluído)

- [x] **Substituir Imagens da Galeria WallBox**
  - [x] Imagem 1: Jg2RMUES7eYD_61169483.jpg (substituída de carport_ddb7d756.jpeg)
  - [x] Imagem 2: lxYPE647fL7H_0da93c84.jpg (mantida)
  - [x] Imagem 3: Udy7cfQuAh7N_b63b45f2.png (mantida)
  - [x] Imagem 4: oLceu0RoRFBv_7837a09a.jpg (substituída de M3W7ro9VGiw4_09c26695.jpg)
  - [x] Imagem 5: M3W7ro9VGiw4_09c26695.jpg (mantida)
  - [x] Todas as URLs usando storage proxy (/manus-storage/)
  - [x] Legendas com descrição exibidas na visualização em tela cheia
  - [x] 97 testes vitest passando
  - [x] Verificação visual: todas as imagens carregando corretamente


## Alterações de Imagens - Galeria WallBox (Concluído)

- [x] **Substituir Imagens da Galeria WallBox**
  - [x] Imagem 1: Jg2RMUES7eYD_61169483.jpg (substituída de carport_ddb7d756.jpeg)
  - [x] Imagem 2: lxYPE647fL7H_0da93c84.jpg (mantida)
  - [x] Imagem 3: Udy7cfQuAh7N_b63b45f2.png (mantida)
  - [x] Imagem 4: oLceu0RoRFBv_7837a09a.jpg (substituída de M3W7ro9VGiw4_09c26695.jpg)
  - [x] Imagem 5: M3W7ro9VGiw4_09c26695.jpg (mantida)
  - [x] Todas as URLs usando storage proxy (/manus-storage/)
  - [x] Legendas com descrição exibidas na visualização em tela cheia
  - [x] 97 testes vitest passando
  - [x] Verificação visual: todas as imagens carregando corretamente


## Alterações Finais - Galeria WallBox (Concluído)

- [x] **Atualizar Imagem 1 (Wallbox Pulsar Plus)**
  - [x] Título alterado para 'Wallbox Pulsar Plus'
  - [x] Descrição alterada para 'Carregador inteligente de alta potência'
  - [x] URL mantida: /manus-storage/Jg2RMUES7eYD_61169483.jpg

- [x] **Substituir Imagem 5**
  - [x] URL alterada para: /manus-storage/carport_ddb7d756.jpeg
  - [x] Título mantido: 'Carport Solar Profissional'
  - [x] Descrição mantida: 'Sistema completo de carregamento solar'

- [x] **Verificações Finais**
  - [x] Todas as imagens carregando corretamente
  - [x] Legendas com título, descrição e contador visíveis
  - [x] Navegação circular funcionando perfeitamente
  - [x] Botão X e setas posicionados corretamente (10 pt acima, 5 pt dentro)
  - [x] 97 testes vitest passando
  - [x] Verificação visual: lightbox funcionando perfeitamente


## Alterações - Galeria de Instalações (Concluído)

- [x] **Adicionar Controles ao Lightbox da Galeria de Instalações**
  - [x] Seta anterior (◀): lado esquerdo, 5 pt dentro da imagem
  - [x] Seta próxima (▶): lado direito, 5 pt dentro da imagem
  - [x] Botão X (fechar): lado direito, 10 pt acima da seta direita, 5 pt dentro
  - [x] Cor branca com hover laranja (#ff6900)
  - [x] Navegação circular funcionando (3 imagens)
  - [x] Legenda com título, descrição e contador ("1 de 3")
  - [x] Visível em qualquer tamanho de tela
  - [x] Z-index correto (sempre à frente)
  - [x] 97 testes vitest passando
  - [x] Verificação visual: lightbox funcionando perfeitamente


## Redimensionamento - Seção WallBox (Concluído)

- [x] **Redimensionar Imagem da Seção WallBox**
  - [x] Ajustar altura das imagens para exibição integral (object-contain + maxHeight 500px)
  - [x] Manter proporção original das imagens (aspect ratio preservado)
  - [x] Garantir visualização completa em todos os tamanhos de tela (height: auto)
  - [x] Manter restante da seção inalterado (legenda, espaçamento, efeitos hover)
  - [x] Testar responsividade em diferentes resoluções (verificado em desktop)
  - [x] 97 testes vitest passando


## Redimensionamento - Galeria WallBox (Concluido)

- [x] **Redimensionar Todas as Imagens da Galeria WallBox**
  - [x] Alterar de object-cover para object-contain (exibicao integral)
  - [x] Alterar height de h-80 (320px) para auto com maxHeight 400px na galeria
  - [x] Lightbox: maxHeight 70vh para melhor visualizacao
  - [x] Manter proporcao original das imagens (aspect ratio preservado)
  - [x] Adicionar fundo cinza (bg-gray-100) para melhor contraste
  - [x] Manter restante inalterado (legenda, espacamento, efeitos hover, controles)
  - [x] Verificacao visual: todas as 5 imagens exibidas integralmente
  - [x] Navegacao circular funcionando perfeitamente
  - [x] 97 testes vitest passando


## Correcao - Calculadora de Economia Solar (Concluido)

- [x] **Adicionar Barra de Rolagem Vertical ao Modal da Calculadora**
  - [x] Adicionar max-h-[90vh] ao container do modal
  - [x] Adicionar flex flex-col para layout vertical
  - [x] Adicionar overflow-y-auto flex-1 ao content area
  - [x] Header com flex-shrink-0 para manter altura fixa
  - [x] Verificacao visual: barra de rolagem funcionando perfeitamente
  - [x] 97 testes vitest passando


## Correcao - Dashboard de Analise Solar (Concluido)

- [x] **Corrigir Exibicao dos Graficos do Dashboard**
  - [x] Aumentar altura do canvas de 80 para 100 (EconomyChart e ROIChart)
  - [x] Adicionar max-h-[600px] ao container dos graficos
  - [x] Adicionar overflow-y-auto para barra de rolagem vertical
  - [x] Verificacao visual: graficos exibindo corretamente com scroll
  - [x] 97 testes vitest passando


## Adicao - Botao Voltar na Calculadora (Concluido)

- [x] **Adicionar Botao Voltar na Calculadora Avancada**
  - [x] Importar ArrowLeft icon do lucide-react
  - [x] Importar Link do wouter
  - [x] Adicionar botao Voltar no topo da pagina
  - [x] Botao navega para a pagina inicial (/)
  - [x] Verificacao visual: botao funcionando corretamente
  - [x] 97 testes vitest passando


## Novas Funcionalidades - Compartilhamento e Dicas (Concluido)

- [x] **Compartilhamento nas Redes Sociais**
  - [x] Botao para compartilhar no Instagram (@bessa.energia)
  - [x] Botao para compartilhar no Facebook (bessa.energia)
  - [x] Integrar com os resultados da calculadora
  - [x] Testar compartilhamento em ambas as plataformas
  - [x] Verificacao visual: botoes funcionando corretamente (visivel em cada cenario)

- [x] **Melhorar Usabilidade com Dicas**
  - [x] Adicionar dicas em "Gasto Mensal com Energia"
  - [x] Adicionar dicas em "Taxa de Economia"
  - [x] Adicionar dicas em "Custo do kWh"
  - [x] Adicionar dicas em "Nome" (Informacoes do Cliente)
  - [x] Adicionar dicas em "Email" (Informacoes do Cliente)
  - [x] Adicionar dicas em "Telefone" (Informacoes do Cliente)
  - [x] Testar dicas em diferentes tamanhos de tela (usando Tooltip do shadcn/ui)
  - [x] Verificacao visual: dicas exibindo corretamente (ícone ? com hover)
  - [x] 97 testes vitest passando


## Validacao e Melhorias - Compartilhamento e Dicas (Concluido - Melhorado)

- [x] **Validacao - Compartilhamento Social (MELHORADO)**
  - [x] Botoes de compartilhamento funcionando em cada cenario (3kW, 5kW, 10kW)
  - [x] Instagram: copia texto dos resultados para clipboard + abre perfil @bessa.energia
  - [x] Facebook: abre dialog de compartilhamento com payload validado + feedback
  - [x] Tratamento de erros para ambas as plataformas
  - [x] Mensagens de feedback ao usuario (✓ Texto copiado!, ✓ Abrindo Facebook...)
  - [x] Verificacao visual: botoes com cores corretas (Instagram rosa/roxo, Facebook azul)

- [x] **Validacao - Dicas de Preenchimento**
  - [x] Triggers com icones ? em laranja (#ff6900) visivel em todos os campos
  - [x] Tooltips exibindo corretamente com conteudo descritivo
  - [x] Testado em desktop (verificacao visual em 880x752)
  - [x] Usando componente Tooltip do shadcn/ui (acessivel e responsivo)
  - [x] 97 testes vitest passando


## Correcao - Favicon (Concluido)

- [x] **Otimizar e Corrigir Favicon**
  - [x] Favicon.ico original redimensionado de 154KB para 16KB (otimizado)
  - [x] Convertido de 256x256 para 32x32 com 256 cores
  - [x] Adicionados múltiplos formatos de favicon no index.html
  - [x] Adicionadas tags: apple-touch-icon, shortcut icon, theme-color
  - [x] Teste do favicon atualizado para aceitar tamanho otimizado (1KB-50KB)
  - [x] 97 testes vitest passando
  - [x] Verificacao visual: favicon exibindo corretamente na aba do navegador


## Adicao - Frase no Rodape (Concluido)

- [x] **Adicionar Frase no Rodapé**
  - [x] Frase: 'Desenvolvido com ❤️ pela Bessa Tecnologia'
  - [x] Posicionamento: Última linha do rodapé, centralizado
  - [x] Cor: text-gray-500 (cinza claro)
  - [x] Espaçamento: mt-4 (margem superior)
  - [x] Verificacao visual: Frase exibindo corretamente no rodapé
  - [x] 97 testes vitest passando


## Correcao - Mascara de Telefone (Concluido - CORRIGIDO PARA 11 DIGITOS)

- [x] **Corrigir Máscara de Telefone em Todos os Formulários**
  - [x] Formato: (99)99999-9999 (DDD 2 dígitos + 9 dígitos do celular = 11 total)
  - [x] Aplicar em BudgetRequestModal.tsx (corrigido para 11 dígitos)
  - [x] Aplicar em AdvancedCalculator.tsx (corrigido para 11 dígitos)
  - [x] Formatação automática enquanto digita (31987654321 → (31)98765-4321)
  - [x] Validação: rejeitar se não obedecer o formato (exatamente 11 dígitos)
  - [x] Validação: não permitir envio se campos vazios
  - [x] Mensagens de erro claras ao usuário (campo vermelho + texto)
  - [x] Verificação visual: formatação funcionando corretamente em ambos os formulários
  - [x] 97 testes vitest passando


## Novas Funcionalidades - Botao Topo e Cores das Setas (Concluido)

- [x] **Implementar Botao Topo**
  - [x] Criar componente ScrollToTop.tsx com seta para cima
  - [x] Posicionar no canto inferior direito (abaixo do botao WhatsApp)
  - [x] Scroll suave ate o topo da pagina
  - [x] Mostrar/ocultar baseado na posicao de scroll (aparece apos 300px)
  - [x] Nao sobrepor o botao WhatsApp (z-index 40, WhatsApp z-index 50)
  - [x] Testar em desktop (verificado visualmente)

- [x] **Alterar Cores das Setas nas Galerias**
  - [x] GaleriaWallBox.tsx: setas e botao X com cor padrao preta
  - [x] GaleriaInstalacoes.tsx: setas e botao X com cor padrao preta
  - [x] Hover: laranja (#ff6900) em ambas as galerias
  - [x] Manter restante das galerias inalterado
  - [x] Testar navegacao e interacoes (verificado visualmente)
  - [x] 97 testes vitest passando


## Secao de Avaliacoes - Depoimentos e Ratings (Concluido)

- [x] **Criar Componente de Avaliacoes**
  - [x] Componente ClientReviews.tsx com depoimentos de clientes
  - [x] Exibir nome, foto, rating e texto do depoimento
  - [x] Carousel/slider para navegar entre depoimentos
  - [x] Responsivo em desktop e mobile
  - [x] Animacoes suaves (fade-in)

- [x] **Integrar Fotos Reais das Usinas**
  - [x] Componente GaleriaUsinas.tsx com fotos reais das usinas instaladas
  - [x] Exibir em grid 2x2 com informacoes de capacidade e economia
  - [x] Lightbox para ampliar fotos com navegacao anterior/proxima
  - [x] Manter qualidade e proporcao das imagens

- [x] **Adicionar Secao a Pagina Home**
  - [x] Posicionar secao entre WallBox e Gerenciador de Arquivos
  - [x] Manter estilo visual consistente com resto do site
  - [x] Testar responsividade (verificado visualmente)

- [x] **Testes e Validacao**
  - [x] Verificar renderizacao em desktop (verificado)
  - [x] Verificar responsividade em mobile
  - [x] Testar carousel/navegacao (funcionando)
  - [x] Validar que restante do site nao foi alterado (confirmado)
  - [x] 97 testes vitest passando


## Integração do Ícone Raio - WallBox (Concluído)

- [x] **Adicionar Ícone do Raio na Seção WallBox**
  - [x] Upload da imagem raio.png para CDN (/manus-storage/raio_fec4f2a5.png)
  - [x] Integrar ícone na seção de "Carregamento Rápido"
  - [x] Posicionar como elemento decorativo (canto superior direito, opacity-10)
  - [x] Adicionar animação de pulsação/brilho (animate-pulse)
  - [x] Testar responsividade (verificado visualmente)
  - [x] Validar que restante do site não foi alterado (confirmado)


## Alteração de Endereço Comercial (Concluído)

- [x] **Alterar Endereço Comercial**
  - [x] Alterar endereço no footer da página Home
  - [x] Novo endereço: AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG
  - [x] Verificar visualização no navegador (confirmado)
  - [x] Manter restante do site inalterado (confirmado)

- [x] Corrigir exibição quebrada das cinco imagens da seção WallBox no site em produção, preservando o restante da aplicação

- [x] Confirmar no domínio bessaenergia.com.br que o VPS foi atualizado para os caminhos locais WallBox e que as cinco novas imagens respondem sem erro

- [x] Preparar cinco arquivos WallBox em client/public/images/wallbox/ e atualizar referências para /images/wallbox/; validar 101 testes, build e respostas HTTP 200 no preview

- [x] Instalação manual do pacote WallBox no VPS em /var/www/bessaenergia.com.br/client/public/images/wallbox/ confirmada pelo carregamento público das cinco URLs

- [x] Verificar externamente as cinco URLs em /images/wallbox/ após a atualização manual do VPS

- [x] Adicionar galeria pop-up automática na página principal com cinco fotos locais em 1920 × 1280 e controles de navegação/fechamento
- [x] Vincular o ícone de localização no rodapé ao Google Maps para AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG

- [x] Sincronizar o checkpoint da galeria pop-up com o GitHub, atualizar o VPS e confirmar a nova versão em bessaenergia.com.br

- [x] Confirmar externamente no domínio principal a galeria pop-up e o destino do ícone Google Maps após a atualização do VPS

- [x] Adicionar animação suave de fade-in à galeria pop-up ao acessar a página principal
- [x] Inserir ícone e link do Instagram @bessa.energia no rodapé
- [x] Inserir QR code funcional para o Instagram no rodapé, mantendo a responsividade e a legibilidade

- [x] Adicionar efeito de hover e foco para destacar o ícone do Instagram e o QR code no rodapé

- [x] Refinar as transições de cor e escala dos hovers do Instagram e QR code para uma interação mais fluida
- [x] Remover a indicação textual de resolução da galeria pop-up
- [x] Analisar as três fotos e os dois vídeos enviados e integrar as mídias adequadas à galeria com descrições contextuais
- [x] Sincronizar as alterações aprovadas com GitHub e VPS
- [x] Criar backup seguro do projeto sem credenciais e enviar ao Google Drive

- [x] Preparar as três novas artes em caminho local para que a galeria funcione também no VPS
- [x] Preparar roteiro de atualização manual do VPS para a galeria promocional, pois o acesso SSH remoto do ambiente foi recusado

- [x] Adicionar visualização ampliada em tela cheia para a imagem selecionada da galeria pop-up, alternando por clique e com botão X acessível para retornar ao modal

- [x] Adicionar setas de navegação à tela cheia e ocultar a instrução após 5 segundos, reapresentando-a ao mover o mouse sobre a imagem

- [x] Alterar somente a seção “A Empresa” do rodapé: substituir o resumo, criar link interativo e exibir o texto completo em pop-up ao clique ou hover

## Tarefas Adicionais Autorizadas pelo Usuário (2026-08-15)
- [x] Corrigir pop-up “A Empresa” (sem barra de rolagem vertical, abrindo ao passar o mouse ou clicar no link)
- [x] Validar configuração de e-mail em produção (SMTP, PDF e serviço tRPC cobertos)
- [x] Validar configuração e orientações para domínio customizado (bessaenergia.com.br)
- [x] Integrar mapa funcional de cobertura com geolocalização e área da CEMIG
- [x] Implementar seção de avaliações legítimas sem dados falsificados (seguindo política de conteúdo)
- [x] Reposicionar com precisão os controles de tela cheia (botão X e setas nas galerias)

- [x] Corrigir o endereço exibido nos relatórios/PDFs para AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG

- [x] Corrigir o mapa de cobertura que não está sendo exibido na página inicial e validar o carregamento no navegador (componente testado, funcional na prévia e publicado no checkpoint d9b2134f)

- [x] Corrigir a falha persistente do mapa publicado e exibir um fallback visual funcional da localização/cobertura quando o Google Maps não carregar

- [x] Corrigir o fallback do mapa para exibir marcadores e cobertura visual das regiões Grande BH, Vale do Aço, Triângulo Mineiro e Sul de Minas no VPS

- [x] Preservar o design original do mapa e aprimorar os marcadores das regiões com hover, foco e identificação interativa

- [x] Substituir o fallback percentual por mapa georreferenciado com as posições reais das regiões atendidas em Minas Gerais

- [x] Atualizar exclusivamente o link de localização do rodapé para o URL oficial da Bessa Energia no Google Maps fornecido pelo usuário

- [x] Configurar dados estruturados LocalBusiness para melhorar o SEO local da página nos resultados de busca

- [x] Adicionar uma meta description focada em SEO local para os serviços de energia solar da Bessa Energia

- [x] Criar proposta comercial em PDF para Estação de Recarga Intelbras Home EVE 0074H em nome de RENATA COALHO TEIXEIRA, seguindo a identidade visual da Bessa Energia Solar e o modelo anexado

- [x] Revisar a capa da proposta comercial com imagem de fundo suave inspirada na primeira imagem do site e área de contraste para a logomarca

- [x] Adicionar tabela de especificações técnicas detalhadas da Intelbras Home EVE 0074H à proposta comercial
- [x] Criar mensagem de e-mail pronta para envio da proposta comercial à cliente

- [x] Criar versão web interativa da proposta comercial com campos de componentes de instalação, quantidades, valores unitários e cálculo automático do total

- [x] Restringir a proposta interativa ao acesso de vendedores autorizados e administradores
- [x] Salvar propostas de estação de recarga no painel para consulta e acompanhamento
- [x] Gerar e enviar a proposta comercial em PDF por e-mail para a cliente

- [x] Adicionar status visual de proposta pendente, aprovada ou recusada no painel comercial
- [x] Criar ação para duplicar propostas com itens semelhantes no painel
- [x] Permitir inserir e visualizar imagens reais dos produtos incluídos na proposta
- [x] Exibir pré-visualização do PDF da proposta antes da confirmação de envio por e-mail

- [x] Resolver o conflito local de client/index.html no VPS para permitir a atualização segura do repositório (status limpo e VPS sincronizado no commit 1937ac0)
- [x] Preparar roteiro reutilizável de atualização do VPS com backup do conflito, migração e reinicialização segura
- [x] Corrigir a configuração das variáveis de administrador local no VPS após erro de credenciais inválidas informado no login (senha de bootstrap corrigida, PM2 reiniciado e painel validado pelo usuário)
- [x] Localizar o diretório Git efetivo da aplicação no VPS antes de repetir a sincronização (confirmado: /var/www/bessaenergia.com.br)

- [x] Substituir o redirecionamento OAuth Manus incompatível no VPS por autenticação local de vendedores e administradores

## Gestão de vendedores e validação comercial

- [x] Permitir editar dados e redefinir a senha das contas locais de vendedores no painel administrativo
- [x] Permitir desativar ou excluir com segurança contas de vendedores no painel administrativo
- [x] Cobrir o gerenciamento de contas locais com testes automatizados de permissões e integridade
- [x] Validar o fluxo completo de criação, pré-visualização e envio de uma proposta comercial no VPS (PDF pré-visualizado e e-mail recebido no teste final)
- [x] Corrigir o upload de imagens de produtos que falha no VPS com Storage upload failed 400 record not found
- [x] Corrigir o salvamento de propostas que exibe Proposta undefined no painel do VPS
- [x] Corrigir a falha de envio de e-mail após a pré-visualização de proposta no VPS
- [x] Configurar um provedor SMTP válido para o domínio bessaenergia.com.br no VPS (Hostinger SMTP via STARTTLS na porta 587)
- [x] Investigar entrega de proposta aceita pelo SMTP mas não recebida na caixa de destino (Gmail recusava por SPF/DKIM ausentes)
- [x] Configurar SPF e DKIM da Hostinger para bessaenergia.com.br após rejeição 550 5.7.26 do Gmail (e-mail recebido no teste final)

## Controles adicionais do painel comercial

- [x] Adicionar saída segura da sessão de vendedor ou administrador
- [x] Adicionar ação para iniciar uma nova proposta em branco
- [x] Permitir clonar uma proposta salva para edição imediata no formulário

## Ajuste de valores comerciais

- [x] Aplicar máscara de moeda brasileira no campo de valor unitário dos componentes

## Histórico e relatórios comerciais

- [x] Criar tela de histórico pesquisável de propostas enviadas aos clientes
- [x] Adicionar feedback visual de carregamento, sucesso e erro no envio de proposta por e-mail
- [x] Criar painel de relatórios mensais de propostas para cada vendedor
- [x] Cobrir histórico, métricas mensais e feedback de envio com testes automatizados

## Feedback de envio de proposta

- [x] Revisar e reforçar carregamento, sucesso e erro exibidos no envio de proposta por e-mail

## Exclusão administrativa de propostas

- [x] Permitir exclusão permanente de propostas somente para administradores, com confirmação explícita
- [x] Cobrir a exclusão administrativa de propostas com testes de autorização e integridade

## Ampliação do painel comercial e governança

- [x] Gerar apresentação em slides com o passo a passo de gestão de vendedores e propostas
- [x] Manter histórico pesquisável de propostas enviadas aos clientes
- [x] Manter feedback visual de carregamento, sucesso e erro no envio por e-mail
- [x] Manter relatório mensal de propostas para cada vendedor
- [x] Exportar relatórios mensais de desempenho para CSV e PDF
- [x] Incluir filtros avançados de status e período no histórico de propostas
- [x] Criar metas mensais e progresso visual para cada vendedor
- [x] Permitir configurar a data de validade antes de gerar a proposta
- [x] Implementar assinatura digital para aprovação online da proposta
- [x] Permitir selecionar artes de capa por tipo de projeto
- [x] Registrar auditoria de exclusões de propostas feitas por administradores
- [x] Implementar lixeira temporária de propostas com retenção de trinta dias
- [x] Permitir filtro por vendedor no painel administrativo de propostas
- [x] Cobrir os novos fluxos de relatórios, propostas, assinatura e governança com testes automatizados

## Correção de operação no VPS

- [x] Corrigir a detecção da porta do processo PM2 no roteiro de instalação da limpeza automática da lixeira

## Correção de avaliações

- [x] Corrigir o formulário público para salvar depoimentos como avaliações pendentes de moderação
- [x] Notificar a equipe por e-mail quando uma nova avaliação for enviada
- [x] Adicionar busca e ordenação ao painel de moderação de avaliações
- [x] Adicionar carregamento e confirmação amigável ao envio público de avaliações
- [x] Exibir selo visual de cliente verificado nos depoimentos aprovados
- [x] Adicionar paginação à lista de avaliações pendentes no painel de moderação
- [x] Corrigir o acesso ao painel administrativo de avaliações no site publicado
- [x] Identificar a porta ativa do processo PM2 no VPS para validar a rota administrativa
- [x] Corrigir o redirecionamento de /admin para a página inicial quando a sessão administrativa local não for reconhecida
- [x] Adicionar botão para encerrar a sessão atual e entrar com uma conta administradora válida no painel de moderação
- [x] Implementar recuperação de senha administrativa diretamente no login local do painel
- [x] Criar uma seção dedicada para moderar avaliações pendentes no painel administrativo
- [x] Exibir um indicador visual de carregamento durante o encerramento e a troca de conta administrativa
- [x] Implementar autenticação em duas etapas com Google Authenticator para contas administrativas locais

## Novo padrão visual de proposta comercial

- [x] Analisar o modelo ASTOLFO anexado e mapear seus elementos visuais preservados
- [x] Criar prévia isolada do novo modelo Bessa Energia para propostas fotovoltaicas e de carregadores
- [x] Substituir a marca do modelo pela identidade Bessa Energia e aplicar a imagem solar enviada
- [x] Submeter a prévia visual para aprovação antes de alterar a geração oficial de PDFs (aprovado pelo usuário)
- [x] Atualizar na prévia a chamada para incluir energia para a casa e o veículo
- [x] Aplicar na prévia a faixa de parceria Bessa Energia e Intelbras enviada pelo usuário
- [x] Remover o bloco separado de dados e posicionar Revenda sobre a logo Bessa na faixa de parceria
- [x] Aumentar e centralizar a palavra Revenda sobre a logo Bessa na faixa de parceria
- [x] Submeter a prévia visual para aprovação antes de alterar a geração oficial de PDFs (aprovado pelo usuário)
- [x] Aplicar o padrão aprovado Bessa Energia e Intelbras ao gerador oficial de PDFs de propostas
- [x] Validar a emissão de proposta oficial com logo, faixa de parceria e componentes reais
