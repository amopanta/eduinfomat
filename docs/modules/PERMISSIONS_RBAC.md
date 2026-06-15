# Modulo Permisos y RBAC

## Backend

Endpoints principales:

- GET /api/roles/permissions
- POST /api/roles/permissions
- PUT /api/roles/permissions/:permissionId
- DELETE /api/roles/permissions/:permissionId
- GET /api/roles/:roleId/permissions
- POST /api/roles/:roleId/permissions
- DELETE /api/roles/:roleId/permissions/:permissionId

## Frontend

Pantalla creada:

```text
/permissions
```

Funciones actuales:

- Listar permisos.
- Buscar permisos.
- Crear permiso.
- Seleccionar permiso.
- Editar nombre y descripcion.
- Eliminar permiso.
- Asignar permiso a rol usando Role ID y Permission ID.
- Consultar permisos asignados a un rol.
- Remover permiso de rol.

## Auditoria

Eventos registrados:

- PERMISSION_CREATED
- PERMISSION_ASSIGNED_TO_ROLE
- PERMISSION_REMOVED_FROM_ROLE

## Pendientes

- Selector visual de roles.
- Selector visual de permisos.
- Evitar errores por duplicados con manejo amigable.
- Proteger endpoints con JWT y guards.
- Crear PermissionsGuard real.
