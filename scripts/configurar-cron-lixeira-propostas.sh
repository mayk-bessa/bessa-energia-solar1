#!/usr/bin/env bash
set -euo pipefail

APP_PORT="${BESSA_APP_PORT:-3000}"
ENDPOINT="http://127.0.0.1:${APP_PORT}/api/scheduled/purge-proposal-trash"
LOG_FILE="/var/log/bessaenergia-purge-proposals.log"
CRON_LINE="0 3 * * * /usr/bin/curl --fail --silent --show-error -X POST '${ENDPOINT}' >> '${LOG_FILE}' 2>&1"

if ! /usr/bin/curl --fail --silent --show-error -X POST "${ENDPOINT}" >/dev/null; then
  echo "Não foi possível validar a limpeza local em ${ENDPOINT}. Confirme a porta do PM2 e execute novamente com BESSA_APP_PORT=<porta>." >&2
  exit 1
fi

touch "${LOG_FILE}"
chmod 640 "${LOG_FILE}"
(crontab -l 2>/dev/null | grep -Fv "/api/scheduled/purge-proposal-trash" || true; echo "${CRON_LINE}") | crontab -
echo "Cron configurado para remover propostas da lixeira todos os dias às 03:00 (horário do VPS)."
