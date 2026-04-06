#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"

cd "$PROJECT_ROOT"

echo "[deploy] building and starting HighlightNote services"
docker compose -f infra/docker-compose.yml up --build -d

echo "[deploy] active services"
docker compose -f infra/docker-compose.yml ps
