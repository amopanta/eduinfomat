# Asistente de instalacion inicial

## Objetivo

Permitir que una instalacion nueva de IF.EDU.INFOMATT cree su primera organizacion y su primer usuario administrador global sin requerir acceso manual a base de datos.

## Backend

Endpoints publicos:

```http
GET /api/install/status
POST /api/install/setup
```

## Reglas de seguridad

- El setup solo funciona si no existen tenants ni usuarios.
- Si la plataforma ya tiene datos iniciales, retorna error.
- El usuario creado recibe rol `SUPER_ADMIN`.
- Se crea un registro de auditoria `INSTALL_COMPLETED`.

## Payload de instalacion

```json
{
  "tenant_name": "INFOMATT",
  "tenant_code": "INFOMATT",
  "admin_email": "admin@infomatt.local",
  "admin_password": "Cambiar123*",
  "admin_first_name": "Admin",
  "admin_last_name": "General"
}
```

## Frontend

Pantalla creada:

```text
/install
```

Desde esta pantalla se puede crear:

- Organizacion inicial.
- Administrador principal.
- Rol SUPER_ADMIN asignado automaticamente.

## Pendiente

- Enlazar visualmente desde login cuando el conector permita modificar ese archivo.
- Agregar validaciones visuales mas fuertes.
- Redirigir automaticamente a login despues de instalar.
