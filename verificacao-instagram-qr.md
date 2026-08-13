# Verificação — Fade-in e Instagram

## Galeria pop-up

No preview da página principal, a galeria foi exibida ao carregar a página e apresentou os controles existentes de fechamento, navegação e seleção de foto. A implementação usa animação de entrada com `framer-motion`: o fundo faz fade-in e o painel surge com opacidade, deslocamento e escala sutis.

## Instagram e QR code

Após fechar a galeria, o DOM do rodapé confirmou dois links acessíveis para `https://www.instagram.com/bessa.energia/`: um associado ao ícone/identificação do perfil e outro associado ao QR code. A visualização detalhada do rodapé será concluída na próxima etapa de validação responsiva.

## Validação visual do rodapé

O preview em desktop confirmou a organização em quatro colunas — empresa, contato, legal e Instagram. O QR code foi exibido em bloco branco compacto ao lado do ícone e do identificador `@bessa.energia`, sem sobrepor os dados de contato, os avisos legais, o botão de WhatsApp ou o botão de retorno ao topo. Em telas menores, a grade utiliza uma coluna antes do breakpoint `md`, preservando a leitura vertical dos elementos.
