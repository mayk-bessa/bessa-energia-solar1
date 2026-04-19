# Bessa Energia - TODO

## Fases Concluídas

- [x] **Fase 1 - Painel Administrativo**: Dashboard com visualização, filtros por status, gerenciamento de orçamentos e leads
- [x] **Fase 2 - Agendamento de Visita Técnica**: Calendário integrado ao formulário (90 dias), rotas tRPC scheduleVisit e getVisits
- [x] **Fase 3 - Notificações por Email**: Templates HTML profissionais, confirmação ao cliente, alertas para equipe de vendas
- [x] **Fase 4 - Exportar Relatórios em PDF**: PDF gerado com sucesso, testes vitest (7 testes)
- [x] **Fase 5 - Calculadora Avançada**: Sliders funcionando, comparativo de cenários (3kW/5kW/10kW), testes vitest (10 testes)
- [x] **Fase 6 - Dashboard Avançado**: 3 gráficos (Economia, ROI, Payback), testes vitest (30 testes), total 90 testes passando

## Validações Manuais Realizadas

### ✅ Testes que Passaram
1. **Sliders da Calculadora**: PASSOU - valores atualizando corretamente
2. **Exportação de PDF**: PASSOU - PDF gerado e baixado com sucesso (2.4 KB)
3. **Gráficos do Dashboard**: PASSOU - todos os 3 gráficos renderizando corretamente
4. **Correção de Chart.js**: PASSOU - BarController e LineController registrados

### ⚠️ Testes que Falharam
1. **Sincronização Calculadora-Dashboard**: FALHOU - contexto não sincroniza entre páginas
   - Alteração de R$ 0.70 para R$ 1.00 no custo do kWh não foi refletida no Dashboard
   - Dashboard continua mostrando R$ 0.70 e economia de R$ 399 (deveria ser R$ 570)

### ⏳ Testes Pendentes
1. **Envio de Email com PDF**: Erro de conexão SMTP (ECONNREFUSED 127.0.0.1:465)
   - Servidor SMTP não configurado
   - Necessário: Configurar servidor SMTP ou usar serviço externo

## Problemas Identificados

### 1. Sincronização de Contexto (CRÍTICO)
- **Problema**: O CalculatorContext não está sincronizando corretamente entre Calculadora e Dashboard
- **Causa**: Possivelmente o Dashboard não está re-renderizando quando o contexto muda
- **Impacto**: Usuários não veem atualizações em tempo real no Dashboard
- **Solução**: Investigar se o Dashboard está consumindo o contexto corretamente e se está re-renderizando

### 2. Email SMTP (MENOR PRIORIDADE)
- **Problema**: Erro ao enviar PDF por email (ECONNREFUSED 127.0.0.1:465)
- **Causa**: Servidor SMTP não está configurado
- **Impacto**: Clientes não recebem PDF por email
- **Solução**: Configurar servidor SMTP ou integrar com SendGrid/Mailgun

## Próximas Tarefas

1. **Corrigir Sincronização do Contexto** (URGENTE)
   - Verificar se o Dashboard está consumindo o contexto corretamente
   - Verificar se o useEffect no AdvancedCalculator está sendo chamado
   - Testar se o setParams está atualizando o contexto globalmente

2. **Configurar Servidor SMTP**
   - Configurar credenciais de SMTP
   - Testar envio de email com PDF

3. **Configurar DNS para solarbh.com**
   - Usuário precisa adicionar domínio no painel Manus
   - Configurar registros DNS

## Fases Futuras

- [ ] **Fase 7 - Integração com Google Maps**: Mostrar localização das usinas e áreas de cobertura
- [ ] **Fase 8 - Sistema de Avaliações**: Depoimentos de clientes e avaliações de projetos

## Resumo de Testes

| Teste | Status | Observações |
|-------|--------|-------------|
| Sliders Calculadora | ✅ PASSOU | Valores atualizando corretamente |
| Exportação PDF | ✅ PASSOU | PDF gerado com sucesso (2.4 KB) |
| Gráficos Dashboard | ✅ PASSOU | 3 gráficos renderizando |
| Chart.js Correção | ✅ PASSOU | BarController e LineController registrados |
| Sincronização Contexto | ❌ FALHOU | Dashboard não reflete mudanças da Calculadora |
| Email SMTP | ⏳ PENDENTE | Servidor não configurado |

## Estatísticas

- **Total de Testes Vitest**: 90 (todos passando)
- **Validações Manuais**: 6 (4 passaram, 1 falhou, 1 pendente)
- **Componentes Implementados**: 11 (Calculadora, Dashboard, 3 Gráficos, etc.)
- **Páginas Implementadas**: 3 (Home, Calculadora Avançada, Dashboard)
