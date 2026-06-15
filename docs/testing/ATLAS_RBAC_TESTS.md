# Pruebas Atlas - RBAC, Roles y Permisos

## Objetivo

Validar que el modulo administrativo de seguridad funcione antes de pasar a Guards reales.

## Pruebas backend

### Roles

- GET /api/roles debe listar roles.
- POST /api/roles debe crear un rol unico por code.
- PUT /api/roles/:roleId debe actualizar nombre y descripcion.
- DELETE /api/roles/:roleId debe eliminar relaciones user_roles y role_permissions antes del rol.

### Permisos

- GET /api/roles/permissions debe listar permisos.
- POST /api/roles/permissions debe crear permiso unico por code.
- PUT /api/roles/permissions/:permissionId debe actualizar nombre y descripcion.
- DELETE /api/roles/permissions/:permissionId debe eliminar relaciones role_permissions antes del permiso.

### Rol-Permiso

- POST /api/roles/:roleId/permissions debe asignar permiso a rol.
- GET /api/roles/:roleId/permissions debe consultar permisos del rol.
- DELETE /api/roles/:roleId/permissions/:permissionId debe remover permiso del rol.

### Usuario-Rol

- POST /api/roles/assign debe asignar rol a usuario.
- GET /api/roles/users/:userId debe listar roles del usuario.

## Pruebas frontend

- /dashboard debe enlazar a /users, /roles y /permissions.
- /roles debe listar, buscar, crear, editar y eliminar roles.
- /permissions debe listar, buscar, crear, editar y eliminar permisos.
- /permissions debe asignar y remover permisos de roles usando Role ID y Permission ID.
- /users debe asignar roles usando Role ID.

## Riesgos conocidos

- Duplicados por claves unicas deben manejarse con mensajes mas amigables.
- Falta proteger endpoints con JwtGuard, RolesGuard y PermissionsGuard.
- Falta selector visual de roles/permisos para evitar copiar IDs manualmente.

## Criterio de salida

Se considera superada esta fase cuando:

- Backend compila.
- Frontend compila.
- Prisma generate funciona.
- CRUD Usuarios, Roles y Permisos puede recorrerse desde UI.
- Asignaciones Usuario-Rol y Rol-Permiso quedan persistidas.
