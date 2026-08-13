# Verificação — Galeria pop-up e localização

## Galeria de Projetos

A página principal abre a galeria automaticamente. A interface apresenta a imagem selecionada, botão de fechar, setas anterior/próxima, indicadores para as cinco fotos e indicação de resolução **1920 × 1280 px**. As cinco imagens usadas são os assets locais em `/images/wallbox/`.

## Link de localização

O ícone de localização no rodapé está configurado com abertura em nova aba e proteção `noopener noreferrer`. O destino é uma busca do Google Maps para:

> AVENIDA GETÚLIO VARGAS, Nº 671, SALA 500, PARTE 1557 SAVASSI, BELO HORIZONTE/MG

## Validações realizadas

| Verificação | Resultado |
|---|---|
| Galeria abre ao acessar a página | Aprovado |
| Botão de fechar, setas e indicadores | Aprovado |
| Cinco imagens locais | Aprovado |
| Resolução informada no modal | 1920 × 1280 px |
| Link do Google Maps | Aprovado, abre em nova aba |
| Testes automatizados | 105 testes Vitest aprovados |
| Build de produção | Aprovado |

