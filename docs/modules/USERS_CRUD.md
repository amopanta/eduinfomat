# Modulo Usuarios - CRUD inicial

## Backend

Endpoints disponibles:

- GET /api/users
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

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
- Crear usuario.
- Desactivar usuario.

## Pendientes

- Edicion visual de usuario.
- Asignacion de roles desde la UI.
- Paginacion.
- Busqueda por correo o nombre.
- Guard por rol para administradores.
