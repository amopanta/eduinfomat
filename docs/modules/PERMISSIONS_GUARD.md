# PermissionsGuard

## Archivos creados

```text
backend/src/rbac/permissions.decorator.ts
backend/src/rbac/permissions.guard.ts
```

## Uso

```ts
@UseGuards(JwtGuard, PermissionsGuard)
@RequirePermission('roles.read')
@Get()
listRoles() {
  return this.service.listRoles();
}
```

## Regla de validacion

1. El usuario debe estar autenticado con JWT.
2. El JWT debe aportar `sub` como `user_id`.
3. El usuario debe tener al menos un rol con el permiso requerido.
4. Si el usuario tiene rol `SUPER_ADMIN`, pasa automaticamente.

## Permisos base agregados al seed

- roles.read
- roles.create
- roles.update
- roles.delete
- roles.assign
- roles.permissions.assign
- roles.permissions.remove
- permissions.read
- permissions.create
- permissions.update
- permissions.delete

## Pendiente recomendado

- Aplicar `JwtGuard` y `PermissionsGuard` tambien en Usuarios y Tenants.
- Crear permisos para auditoria: `audit.read`.
- Crear permisos academicos: `courses.*`, `lessons.*`, `evaluations.*`.
