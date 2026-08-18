#!/usr/bin/env bash

# Atualiza a aplicação Bessa Energia no VPS e preserva o arquivo local que
# anteriormente bloqueava o git pull. Execute no VPS com um usuário que tenha
# permissão de escrita em /var/www/bessaenergia.com.br e acesso ao PM2.

set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/bessaenergia.com.br}"
PM2_APP="${PM2_APP:-bessaenergia}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/bessaenergia-git}"

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Erro: repositório Git não encontrado em $APP_DIR" >&2
  exit 1
fi

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "Erro: o arquivo .env não existe em $APP_DIR" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
timestamp="$(date +%Y%m%d-%H%M%S)"

if ! grep -Eq '^LOCAL_AUTH_BOOTSTRAP_EMAIL=\S+@\S+\.\S+$' .env; then
  echo "Erro: LOCAL_AUTH_BOOTSTRAP_EMAIL não está configurado corretamente no .env" >&2
  exit 1
fi

if ! node -e "require('dotenv').config(); process.exit((process.env.LOCAL_AUTH_BOOTSTRAP_PASSWORD || '').length >= 16 ? 0 : 1)"; then
  echo "Erro: LOCAL_AUTH_BOOTSTRAP_PASSWORD precisa ter ao menos 16 caracteres" >&2
  exit 1
fi

if [[ -n "$(git status --short -- client/index.html)" ]]; then
  cp -a client/index.html "$BACKUP_DIR/index.html.$timestamp"
  git restore --source=HEAD --staged --worktree client/index.html
  echo "Backup criado em $BACKUP_DIR/index.html.$timestamp"
fi

git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm db:push
pnpm build
pm2 restart "$PM2_APP" --update-env
pm2 save

echo "Atualização concluída. Verifique https://bessaenergia.com.br/proposta-estacao-recarga"
