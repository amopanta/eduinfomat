# Sprint 1 - API Inicial

## Health

GET /api/health

## Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

## Users

GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

## Tenants

GET /api/tenants
GET /api/tenants/:id
POST /api/tenants
PUT /api/tenants/:id
DELETE /api/tenants/:id

## Roles

GET /api/roles
POST /api/roles
POST /api/roles/assign
GET /api/roles/users/:userId
GET /api/roles/:roleId/permissions

## Headers

Authorization: Bearer TOKEN
X-Tenant-ID: TENANT_ID

## Nota

En Sprint 1, X-Tenant-ID puede usarse temporalmente para pruebas. En produccion debe derivarse del JWT.
