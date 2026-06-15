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
  (uuid_generate_v4(), 'users.delete', 'Eliminar usuarios', 'Desactivar usuarios'),
  (uuid_generate_v4(), 'tenants.read', 'Leer tenants', 'Consultar tenants'),
  (uuid_generate_v4(), 'tenants.create', 'Crear tenants', 'Crear tenants'),
  (uuid_generate_v4(), 'tenants.update', 'Actualizar tenants', 'Actualizar tenants'),
  (uuid_generate_v4(), 'tenants.delete', 'Eliminar tenants', 'Desactivar tenants')
ON CONFLICT (code) DO NOTHING;
