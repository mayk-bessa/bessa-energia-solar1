# Bessa Energia - TODO

## Fases Concluídas

- [x] **Fase 1 - Painel Administrativo**: Dashboard com visualização, filtros por status, gerenciamento de orçamentos e leads
- [x] **Fase 2 - Agendamento de Visita Técnica**: Calendário integrado ao formulário (90 dias), rotas tRPC scheduleVisit e getVisits
- [x] **Fase 3 - Notificações por Email**: Templates HTML profissionais, confirmação ao cliente, alertas para equipe de vendas

## Fases Concluídas

- [x] **Fase 4 - Exportar Relatórios em PDF**:
  - [x] Componente SolarCalculatorModal atualizado com campos de cliente (nome, email, telefone)
  - [x] Rota tRPC budget.generateReport implementada
  - [x] Função generateSolarReportPDF criada (pdf-lib)
  - [x] Função sendPDFReportEmail criada
  - [x] Testes vitest para exportação de PDF (7 testes passando)
  - [x] Botão "Exportar PDF" adicionado à calculadora
  - [x] Envio de PDF por email ao cliente implementado

## Fases Concluídas (Continuação)

- [x] **Fase 5 - Calculadora Avançada**:
  - [x] Criar componente AdvancedCalculator com sliders
  - [x] Implementar slider para taxa de economia (70%-95%)
  - [x] Implementar slider para custo do kWh (R$ 0.50 - R$ 1.50) - **AGORA AFETA OS CÁLCULOS**
  - [x] Criar comparativo de cenários (3kW, 5kW, 10kW)
  - [x] Adicionar visualização de comparação lado a lado
  - [x] Integrar com rota tRPC para cálculos avançados (exportação de PDF)
  - [x] Escrever testes vitest para componente (10 testes passando, todos verdes)
  - [x] Adicionar link na página Home para calculadora avançada
  - [x] Fórmula de cálculo corrigida: Economia = kWh produzidos * custo do kWh * taxa de economia

## Fases Futuras

- [ ] **Fase 6 - Dashboard Avançado**: Gráficos de economia ao longo do tempo, ROI, e histórico de orçamentos
- [ ] **Fase 7 - Integração com Google Maps**: Mostrar localização das usinas e áreas de cobertura
- [ ] **Fase 8 - Sistema de Avaliações**: Depoimentos de clientes e avaliações de projetos

## Tarefas Gerais

- [ ] Configurar DNS para solarbh.com (usuário precisa adicionar domínio no painel Manus)
- [x] Implementação completa de exportação de PDF com testes
- [x] Implementação da Calculadora Avançada com sliders e comparativo
- [ ] Testar fluxo completo de exportação de PDF no navegador (validação manual)
- [ ] Validar envio de email com PDF anexado (validação manual)
- [ ] Testar sliders da calculadora avançada no navegador (validação manual)
