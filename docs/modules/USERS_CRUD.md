# Modulo Usuarios - CRUD

## Backend

Endpoints disponibles:

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- POST /api/roles/assign

Para listar usuarios por tenant se usa temporalmente el header:

```http
x-tenant-id: TENANT_ID
```

## Frontend

Pantalla creada:

```text
/users
```

Funciones actuales:

- Ingresar Tenant ID.
- Listar usuarios del tenant.
- Buscar usuario por nombre, correo o estado.
- Crear usuario.
- Seleccionar usuario.
- Editar nombres, apellidos y estado.
- Desactivar usuario.
- Asignar rol usando Role ID.

## Pendientes

- Selector visual de roles.
- Consulta visual de roles asignados por usuario.
- Paginacion.
- Guard por rol para administradores.
