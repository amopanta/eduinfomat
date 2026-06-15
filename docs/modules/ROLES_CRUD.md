# Modulo Roles - CRUD inicial

## Backend

Endpoints disponibles:

- GET /api/roles
- POST /api/roles
- PUT /api/roles/:roleId
- DELETE /api/roles/:roleId
- POST /api/roles/assign
- GET /api/roles/users/:userId
- GET /api/roles/:roleId/permissions

## Frontend

Pantalla creada:

```text
/roles
```

Funciones actuales:

- Listar roles.
- Buscar roles por codigo, nombre o descripcion.
- Crear rol.
- Seleccionar rol.
- Editar nombre y descripcion.
- Eliminar rol.

## Pendientes

- Desactivacion logica en vez de eliminacion fisica.
- Editor visual de permisos por rol.
- Auditoria de creacion, edicion y eliminacion de roles.
- Guard por rol para administradores.
