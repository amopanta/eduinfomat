# ATLAS REVIEW v1 - IF.EDU.INFOMATT

Fecha: 2026-06-15
Repositorio: amopanta/eduinfomat

## Resumen ejecutivo

La plataforma ya tiene una base administrativa fuerte: Auth JWT, usuarios, roles, permisos, RBAC, PermissionsGuard y proteccion inicial de endpoints administrativos. Durante esta revision se corrigieron hallazgos reales de seguridad y rutas.

Estado recomendado: **GO CON RESERVAS para Beta Administrativa**, condicionado a ejecutar build real backend/frontend y Prisma generate.

## Hallazgos criticos corregidos

### CRIT-001 - Tenants sin proteccion RBAC

Estado: Corregido.

Antes:

- `TenantsController` exponia endpoints CRUD sin `JwtGuard` ni `PermissionsGuard`.

Accion aplicada:

- Se agrego `@UseGuards(JwtGuard, PermissionsGuard)`.
- Se aplicaron permisos:
  - `tenants.read`
  - `tenants.create`
  - `tenants.update`
  - `tenants.delete`
- Se actualizo `TenantsModule` para registrar `JwtGuard` y `PermissionsGuard`.

### CRIT-002 - Conflicto potencial de rutas RBAC

Estado: Corregido.

Riesgo:

- Rutas como `DELETE /roles/permissions/:permissionId` podian entrar en conflicto con `DELETE /roles/:roleId` si el orden no era adecuado.

Accion aplicada:

- Se reordeno `RbacController` dejando rutas especificas antes de rutas dinamicas.

## Hallazgos altos

### HIGH-001 - Falta validacion real de build

Estado: Pendiente.

No se pudo confirmar por ejecucion real:

- `npm run build` backend.
- `npm run build` frontend.
- `npx prisma generate`.
- migraciones reales contra PostgreSQL.

Recomendacion:

Ejecutar GitHub Actions o validacion local cuando haya runner disponible.

### HIGH-002 - Seed no asigna permisos automaticamente a SUPER_ADMIN

Estado: Pendiente.

El `PermissionsGuard` permite acceso automatico si el usuario tiene rol `SUPER_ADMIN`, pero el sistema aun requiere que exista usuario con ese rol asignado.

Recomendacion:

Crear seed de usuario administrador inicial o asistente de instalacion para generar primer SUPER_ADMIN.

### HIGH-003 - Manejo de duplicados poco amigable

Estado: Pendiente.

Tablas con `code` unico pueden fallar por duplicados:

- roles.code
- permissions.code
- tenants.code
- users.email

Recomendacion:

Capturar errores Prisma `P2002` y retornar mensajes claros.

## Hallazgos medios

### MED-001 - Frontend usa IDs manuales

Estado: Pendiente.

Pantallas actuales piden manualmente:

- Tenant ID
- Role ID
- Permission ID

Recomendacion:

Agregar selectores visuales alimentados por API.

### MED-002 - MultiTenant aun es parcial

Estado: Pendiente.

Usuarios se listan por header `x-tenant-id`, pero idealmente debe derivarse de JWT o controlarse segun permisos del usuario.

Recomendacion:

Para usuarios no SUPER_ADMIN, ignorar header externo y usar `request.user.tenant_id`.

### MED-003 - Auditoria visual no existe aun

Estado: Pendiente.

La tabla `audit_logs` y varios eventos existen, pero falta:

- API de consulta.
- filtros.
- pantalla `/audit`.
- exportaciones.

## Hallazgos bajos

### LOW-001 - Estilos frontend basicos

Estado: Pendiente.

La UI funcional existe, pero requiere layout profesional:

- Sidebar.
- Header.
- estados vacios.
- confirmaciones.
- modales.

### LOW-002 - Documentacion tecnica dispersa

Estado: Parcial.

Hay documentacion de usuarios, permisos, guardas y pruebas Atlas. Falta un indice general de docs.

## Validaciones Atlas realizadas por inspeccion

- JWT usa `sub` como `user_id`.
- `PermissionsGuard` lee `request.user.sub`, por tanto coincide con Auth.
- `RbacController` esta protegido con `JwtGuard` y `PermissionsGuard`.
- `UsersController` esta protegido con `JwtGuard` y `PermissionsGuard`.
- `TenantsController` fue protegido durante esta revision.
- `seed.sql` contiene permisos base de usuarios, tenants, roles y permisos.

## Criterios pendientes para Beta

Antes de declarar Beta Administrativa estable:

- Backend build OK.
- Frontend build OK.
- Prisma generate OK.
- Migrate/status OK.
- Crear usuario SUPER_ADMIN inicial.
- Probar login real.
- Probar listado usuarios con token.
- Probar CRUD roles con permisos.
- Probar CRUD permisos con permisos.
- Probar tenants con permisos.

## Recomendacion de siguiente sprint

1. Crear `AuditController` y `AuditService` de consulta.
2. Crear pantalla `/audit`.
3. Crear menu dinamico por permisos.
4. Mejorar manejo de errores Prisma.
5. Crear seed/asistente para primer SUPER_ADMIN.

## Decision Go / No-Go

**GO CON RESERVAS** para continuar desarrollo de Beta Administrativa.

No se recomienda iniciar Cursos hasta confirmar build real y cerrar:

- usuario admin inicial,
- auditoria visual,
- menu dinamico,
- manejo de errores duplicados.
