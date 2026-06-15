# Sprint 1 - Modelo de Datos Inicial

## Tablas

- tenants
- users
- roles
- permissions
- user_roles
- role_permissions
- audit_logs

## Principios

- Todas las entidades operativas deben incluir tenant_id cuando aplique.
- Todo evento critico debe registrarse en audit_logs.
- No se elimina informacion critica sin trazabilidad.

## Estado

Modelo base creado en backend/prisma/schema.prisma.
