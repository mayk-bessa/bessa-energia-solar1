#!/usr/bin/env bash
set -euo pipefail

EXPLICIT_APP_PORT="${BESSA_APP_PORT:-}"
LOG_FILE="/var/log/bessaenergia-purge-proposals.log"

if [[ -n "${EXPLICIT_APP_PORT}" ]]; then
  CANDIDATE_PORTS=("${EXPLICIT_APP_PORT}")
else
  CANDIDATE_PORTS=()
  for port in $(seq 3000 3019); do
    CANDIDATE_PORTS+=("${port}")
  done
fi

APP_PORT=""
for candidate_port in "${CANDIDATE_PORTS[@]}"; do
  if [[ ! "${candidate_port}" =~ ^[0-9]{2,5}$ ]]; then
    echo "A porta informada não é válida: ${candidate_port}" >&2
    exit 1
  fi

  health_endpoint="http://127.0.0.1:${candidate_port}/api/scheduled/purge-proposal-trash"
  if /usr/bin/curl --fail --silent --show-error --max-time 5 "${health_endpoint}" >/dev/null 2>&1; then
    APP_PORT="${candidate_port}"
    break
  fi
done

if [[ -z "${APP_PORT}" ]]; then
  echo "Não foi possível localizar o processo Bessa Energia nas portas 3000 a 3019. Execute 'pm2 logs bessaenergia --lines 100 --nostream' e informe a porta exibida; então repita com BESSA_APP_PORT=<porta>." >&2
  exit 1
fi

ENDPOINT="http://127.0.0.1:${APP_PORT}/api/scheduled/purge-proposal-trash"
CRON_LINE="0 3 * * * /usr/bin/curl --fail --silent --show-error -X POST '${ENDPOINT}' >> '${LOG_FILE}' 2>&1"

echo "Processo Bessa Energia localizado na porta ${APP_PORT}."

touch "${LOG_FILE}"
chmod 640 "${LOG_FILE}"
(crontab -l 2>/dev/null | grep -Fv "/api/scheduled/purge-proposal-trash" || true; echo "${CRON_LINE}") | crontab -
echo "Cron configurado para remover propostas da lixeira todos os dias às 03:00 (horário do VPS)."
