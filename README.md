# EnergeX AI — Python/DRF + PostgreSQL + Redis + React

[![CI](https://github.com/andrei-kolesnik-california/my-energeX-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/andrei-kolesnik-california/my-energeX-demo/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![Django REST](https://img.shields.io/badge/Django-REST-ff1709?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

Daniel confirmed I can use any stack, so I built this in Django REST Framework + PostgreSQL + Redis + React.
It preserves the original endpoints and caching semantics.

## Stack
- Backend API: Django + DRF, JWT (SimpleJWT), Swagger via drf-spectacular
- DB: PostgreSQL
- Cache: Redis (cache-aside; TTL=90s); keys: `posts:all`, `posts:{id}`
- Frontend: React (Vite) using Axios
- Docker: docker-compose for db, redis, api, frontend
- CI: GitHub Actions (pytest)

## Endpoints
- `POST /api/register` — Register (username, full_name, email, password)
- `POST /api/login` — JWT login (returns `access`)
- `GET  /api/posts` — List posts (cached in Redis)
- `POST /api/posts` — Create post (invalidates `posts:all`)
- `GET  /api/posts/{id}` — Single post (cached in Redis)

## API Docs
- OpenAPI schema: `GET /api/schema/`
- Swagger UI: `GET /api/docs/`

## Run locally
```bash
docker compose up --build
# API:     http://localhost:8000
# Docs:    http://localhost:8000/api/docs/
# Frontend http://localhost:3000
```

## Tests

### Docker (recommended)
Runs tests fully inside containers (same network as `db` and `redis`):

```bash
# One-off test run
docker compose build testing
docker compose run --rm testing
```

## Notes
- Replaced MySQL with PostgreSQL; can swap via env/engine.
- Redis is a separate container (best practice). One Redis per environment with key prefixes.
- Security: passwords hashed, JWT with expiry, CORS enabled for demo.
- Planned extensions: RBAC, GraphQL, WebSockets.
