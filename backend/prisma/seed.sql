INSERT INTO roles (role_id, code, name, description, created_at)
VALUES
  (gen_random_uuid(), 'SUPER_ADMIN', 'Super Admin', 'Administrador global', NOW()),
  (gen_random_uuid(), 'TENANT_ADMIN', 'Tenant Admin', 'Administrador de tenant', NOW()),
  (gen_random_uuid(), 'ACADEMIC_ADMIN', 'Academic Admin', 'Administrador academico', NOW()),
  (gen_random_uuid(), 'INSTRUCTOR', 'Instructor', 'Instructor o mentor', NOW()),
  (gen_random_uuid(), 'STUDENT', 'Student', 'Estudiante', NOW())
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (permission_id, code, name, description)
VALUES
  (gen_random_uuid(), 'users.read', 'Leer usuarios', 'Consultar usuarios'),
  (gen_random_uuid(), 'users.create', 'Crear usuarios', 'Crear usuarios'),
  (gen_random_uuid(), 'users.update', 'Actualizar usuarios', 'Actualizar usuarios'),
  (gen_random_uuid(), 'users.delete', 'Eliminar usuarios', 'Desactivar usuarios'),
  (gen_random_uuid(), 'tenants.read', 'Leer tenants', 'Consultar tenants'),
  (gen_random_uuid(), 'tenants.create', 'Crear tenants', 'Crear tenants'),
  (gen_random_uuid(), 'tenants.update', 'Actualizar tenants', 'Actualizar tenants'),
  (gen_random_uuid(), 'tenants.delete', 'Eliminar tenants', 'Desactivar tenants')
ON CONFLICT (code) DO NOTHING;
