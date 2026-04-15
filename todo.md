# Bessa Energia - TODO

## Fases Concluídas

- [x] **Fase 1 - Painel Administrativo**: Dashboard com visualização, filtros por status, gerenciamento de orçamentos e leads
- [x] **Fase 2 - Agendamento de Visita Técnica**: Calendário integrado ao formulário (90 dias), rotas tRPC scheduleVisit e getVisits
- [x] **Fase 3 - Notificações por Email**: Templates HTML profissionais, confirmação ao cliente, alertas para equipe de vendas

## Fases Concluídas (Continuação)

- [x] **Fase 4 - Exportar Relatórios em PDF**:
  - [x] Componente SolarCalculatorModal atualizado com campos de cliente (nome, email, telefone)
  - [x] Rota tRPC budget.generateReport implementada
  - [x] Função generateSolarReportPDF criada (pdf-lib)
  - [x] Função sendPDFReportEmail criada
  - [x] Testes vitest para exportação de PDF (7 testes passando)
  - [x] Botão "Exportar PDF" adicionado à calculadora
  - [x] Envio de PDF por email ao cliente implementado

## Fases em Andamento

Nenhuma fase em andamento no momento.

## Fases Futuras

- [ ] **Fase 5 - Calculadora Avançada**: Sliders para ajustar taxa de economia, custo do kWh, comparativo de cenários (3kW/5kW/10kW)
- [ ] **Fase 6 - Dashboard Avançado**: Gráficos de conversão, relatórios de ROI, análise de leads

## Tarefas Gerais

- [ ] Configurar DNS para solarbh.com (usuário precisa adicionar domínio no painel Manus)
- [x] Implementação completa de exportação de PDF com testes
- [ ] Testar fluxo completo de exportação de PDF no navegador (validação manual)
- [ ] Validar envio de email com PDF anexado (validação manual)
