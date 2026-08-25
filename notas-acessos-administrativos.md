# Acessos administrativos confirmados

| Endereço | Serviço | Fluxo de acesso confirmado |
|---|---|---|
| `https://bessaenergia.com.br/admin` | Painel administrativo Bessa Energia | Conta local administrativa; após a publicação da correção, oferece recuperação de senha e Google Authenticator quando ativado. |
| `https://bessaenergia.com.br/proposta-estacao-recarga` | Painel comercial de propostas | Conta local de vendedor ou administrador. |
| `https://painel.bessaenergia.com.br` | MailCraft, painel de e-mail marketing | Login próprio via fluxo OAuth do MailCraft; não utiliza a conta local do painel Bessa. |

O acesso público de `/admin` respondeu a rota da aplicação, mas a versão externa anterior apresentou tela em branco devido ao erro de `Select.Item` que está sendo corrigido neste projeto. O subdomínio `painel.bessaenergia.com.br` apresentou a página de login do MailCraft em 25 de agosto de 2026.
