#!/usr/bin/env bash
set -e

echo "Waiting for Postgres at $POSTGRES_HOST:$POSTGRES_PORT..."
until python - <<'PY'
import os, socket
s = socket.socket()
host=os.getenv('POSTGRES_HOST','db')
port=int(os.getenv('POSTGRES_PORT','5432'))
try:
    s.connect((host, port))
    print('ok')
except Exception as e:
    raise SystemExit(1)
PY
do sleep 1; done

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true
python manage.py runserver 0.0.0.0:8000
