INSERT INTO roles (role_id, code, name, description, created_at)
VALUES
  (uuid_generate_v4(), 'SUPER_ADMIN', 'Super Admin', 'Administrador global', NOW()),
  (uuid_generate_v4(), 'TENANT_ADMIN', 'Tenant Admin', 'Administrador de tenant', NOW()),
  (uuid_generate_v4(), 'ACADEMIC_ADMIN', 'Academic Admin', 'Administrador academico', NOW()),
  (uuid_generate_v4(), 'INSTRUCTOR', 'Instructor', 'Instructor o mentor', NOW()),
  (uuid_generate_v4(), 'STUDENT', 'Student', 'Estudiante', NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (permission_id, code, name, description)
VALUES
  (uuid_generate_v4(), 'users.read', 'Leer usuarios', 'Consultar usuarios'),
  (uuid_generate_v4(), 'users.create', 'Crear usuarios', 'Crear usuarios'),
  (uuid_generate_v4(), 'users.update', 'Actualizar usuarios', 'Actualizar usuarios'),
  (uuid_generate_v4(), 'users.delete', 'Desactivar usuarios', 'Desactivar usuarios'),
  (uuid_generate_v4(), 'users.roles.assign', 'Asignar roles desde usuarios', 'Asignar roles a usuarios desde el modulo de usuarios'),
  (uuid_generate_v4(), 'tenants.read', 'Leer tenants', 'Consultar tenants'),
  (uuid_generate_v4(), 'tenants.create', 'Crear tenants', 'Crear tenants'),
  (uuid_generate_v4(), 'tenants.update', 'Actualizar tenants', 'Actualizar tenants'),
  (uuid_generate_v4(), 'tenants.delete', 'Desactivar tenants', 'Desactivar tenants'),
  (uuid_generate_v4(), 'roles.read', 'Leer roles', 'Consultar roles y roles de usuarios'),
  (uuid_generate_v4(), 'roles.create', 'Crear roles', 'Crear roles'),
  (uuid_generate_v4(), 'roles.update', 'Actualizar roles', 'Actualizar roles'),
  (uuid_generate_v4(), 'roles.delete', 'Eliminar roles', 'Eliminar roles'),
  (uuid_generate_v4(), 'roles.assign', 'Asignar roles', 'Asignar roles a usuarios'),
  (uuid_generate_v4(), 'roles.permissions.assign', 'Asignar permisos a roles', 'Asignar permisos a roles'),
  (uuid_generate_v4(), 'roles.permissions.remove', 'Remover permisos de roles', 'Remover permisos de roles'),
  (uuid_generate_v4(), 'permissions.read', 'Leer permisos', 'Consultar permisos'),
  (uuid_generate_v4(), 'permissions.create', 'Crear permisos', 'Crear permisos'),
  (uuid_generate_v4(), 'permissions.update', 'Actualizar permisos', 'Actualizar permisos'),
  (uuid_generate_v4(), 'permissions.delete', 'Eliminar permisos', 'Eliminar permisos'),
  (uuid_generate_v4(), 'audit.read', 'Leer auditoria', 'Consultar eventos de auditoria'),
  (uuid_generate_v4(), 'audit.export', 'Exportar auditoria', 'Exportar eventos de auditoria'),
  (uuid_generate_v4(), 'courses.read', 'Leer cursos', 'Consultar cursos'),
  (uuid_generate_v4(), 'courses.create', 'Crear cursos', 'Crear cursos'),
  (uuid_generate_v4(), 'courses.update', 'Actualizar cursos', 'Actualizar cursos'),
  (uuid_generate_v4(), 'courses.delete', 'Desactivar cursos', 'Desactivar cursos'),
  (uuid_generate_v4(), 'modules.read', 'Leer modulos', 'Consultar modulos'),
  (uuid_generate_v4(), 'modules.create', 'Crear modulos', 'Crear modulos'),
  (uuid_generate_v4(), 'modules.update', 'Actualizar modulos', 'Actualizar modulos'),
  (uuid_generate_v4(), 'modules.delete', 'Desactivar modulos', 'Desactivar modulos')
ON CONFLICT (code) DO NOTHING;
