# IF.EDU.INFOMATT

Repositorio oficial del proyecto **IF.EDU.INFOMATT / INFOMATT Enterprise**.

Estado actual: **Baseline 0.1 — Sprint 1 Foundation**

## Objetivo

Construir una plataforma SaaS multiempresa, No-Code First, AI-Native y Content-as-Data para formación profesional basada en escenarios reales, metodología MATT, certificaciones verificables y mentoría IA.

## Sprint 1 — Fundación

Alcance inicial:

- Docker / Docker Compose
- PostgreSQL
- Redis
- Backend base NestJS
- Frontend base Next.js
- MultiTenant base
- JWT base
- RBAC base
- Auditoría base
- Documentación técnica inicial

## Estructura

```text
eduinfomat/
├── backend/
├── frontend/
├── infrastructure/
├── docs/
├── docker-compose.yml
└── README.md
```

## Principios congelados

- No-Code First
- Business Configuration First
- Content-as-Data
- MultiTenant First
- API First
- AI Native
- Version Everything
- Security by Design
- Documentation First
- Configuration over Coding

## Ejecución local

```bash
docker compose up --build
```

Servicios esperados:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000/api/health
Postgres: localhost:5432
Redis:    localhost:6379
```
