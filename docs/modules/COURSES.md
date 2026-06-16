# Modulo Courses

## Objetivo

Primer modulo academico de INFOMATT. Permite gestionar cursos por tenant, instructor, categoria y estado.

## Modelo Prisma

Tabla:

```text
courses
```

Campos principales:

- course_id
- tenant_id
- instructor_id
- code
- name
- description
- category
- status
- created_at
- updated_at

Restriccion:

```text
unique tenant_id + code
```

## Backend

Endpoints protegidos:

```http
GET /api/courses
GET /api/courses/:id
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
```

Permisos requeridos:

- courses.read
- courses.create
- courses.update
- courses.delete

## Frontend

Pantalla creada:

```text
/courses
```

Funciones actuales:

- Ingresar Tenant ID.
- Listar cursos del tenant.
- Buscar cursos.
- Crear curso.
- Editar curso.
- Desactivar curso.
- Asignar instructor por Instructor ID.

## Auditoria

Eventos registrados:

- COURSE_CREATED
- COURSE_UPDATED
- COURSE_DEACTIVATED

## Pendientes

- Enlazar visualmente desde dashboard cuando el conector permita editarlo.
- Selector visual de instructor.
- Derivar tenant desde JWT para usuarios no SUPER_ADMIN.
- Manejo amigable de duplicados por codigo.
- Modulos y lecciones del curso.
