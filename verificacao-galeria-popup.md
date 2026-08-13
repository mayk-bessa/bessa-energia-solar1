# Verificação — Galeria pop-up e localização

## Galeria de Projetos

A página principal abre a galeria automaticamente. A interface apresenta a imagem selecionada, botão de fechar, setas anterior/próxima, indicadores para oito itens e descrição contextual de cada mídia. As cinco imagens de WallBox usam os assets locais em `/images/wallbox/`; três artes adicionais usam o armazenamento estático do projeto.

## Link de localização

O ícone de localização no rodapé está configurado com abertura em nova aba e proteção `noopener noreferrer`. O destino é uma busca do Google Maps para:

> AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG

## Validações realizadas

| Verificação | Resultado |
|---|---|
| Galeria abre ao acessar a página | Aprovado |
| Botão de fechar, setas e indicadores | Aprovado |
| Oito imagens com descrição contextual | Aprovado |
| Indicação fixa de resolução no modal | Removida |
| Link do Google Maps | Aprovado, abre em nova aba |
| Testes automatizados | 110 testes Vitest aprovados |
| Build de produção | Aprovado |

## Confirmação no VPS

Em 13 de agosto de 2026, a versão foi confirmada diretamente em `https://bessaenergia.com.br` após a atualização do VPS. A galeria pop-up abriu ao carregar a página e as cinco imagens locais reportaram `complete: true` com dimensão natural de **1920 × 1280 px**. O ícone de localização também foi verificado no domínio público e encaminha, em nova aba, para a busca correspondente no Google Maps.

## Ampliação da galeria

Três artes promocionais fornecidas pelo usuário foram incorporadas ao modal, com descrições breves sobre economia, previsibilidade tarifária e condições de pagamento. As fotos de formato vertical e quadrado continuam centralizadas com `object-contain`, sem corte obrigatório.
