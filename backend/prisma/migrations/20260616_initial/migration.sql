-- EDU-INFOMATT initial schema migration
-- Generated from backend/prisma/schema.prisma

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "tenants" (
  "tenant_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'company',
  "status" TEXT NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("tenant_id")
);

CREATE TABLE IF NOT EXISTS "users" (
  "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "phone" TEXT,
  "avatar_url" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "last_login" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE IF NOT EXISTS "roles" (
  "role_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

CREATE TABLE IF NOT EXISTS "permissions" (
  "permission_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

CREATE TABLE IF NOT EXISTS "user_roles" (
  "user_role_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_role_id")
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
  "role_permission_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_permission_id")
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
  "token_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("token_id")
);

CREATE TABLE IF NOT EXISTS "courses" (
  "course_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL,
  "instructor_id" UUID,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

CREATE TABLE IF NOT EXISTS "modules" (
  "module_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "course_id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "modules_pkey" PRIMARY KEY ("module_id")
);

CREATE TABLE IF NOT EXISTS "lessons" (
  "lesson_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "module_id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "lesson_type" TEXT NOT NULL,
  "content" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lessons_pkey" PRIMARY KEY ("lesson_id")
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
  "audit_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "tenant_id" UUID,
  "user_id" UUID,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("audit_id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tenants_code_key" ON "tenants"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "roles_code_key" ON "roles"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_code_key" ON "permissions"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");
CREATE UNIQUE INDEX IF NOT EXISTS "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");
CREATE UNIQUE INDEX IF NOT EXISTS "courses_tenant_id_code_key" ON "courses"("tenant_id", "code");
CREATE UNIQUE INDEX IF NOT EXISTS "modules_course_id_code_key" ON "modules"("course_id", "code");
CREATE UNIQUE INDEX IF NOT EXISTS "lessons_module_id_code_key" ON "lessons"("module_id", "code");

CREATE INDEX IF NOT EXISTS "users_tenant_id_idx" ON "users"("tenant_id");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");
CREATE INDEX IF NOT EXISTS "user_roles_user_id_idx" ON "user_roles"("user_id");
CREATE INDEX IF NOT EXISTS "user_roles_role_id_idx" ON "user_roles"("role_id");
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
CREATE INDEX IF NOT EXISTS "courses_tenant_id_idx" ON "courses"("tenant_id");
CREATE INDEX IF NOT EXISTS "courses_instructor_id_idx" ON "courses"("instructor_id");
CREATE INDEX IF NOT EXISTS "courses_status_idx" ON "courses"("status");
CREATE INDEX IF NOT EXISTS "modules_course_id_idx" ON "modules"("course_id");
CREATE INDEX IF NOT EXISTS "modules_status_idx" ON "modules"("status");
CREATE INDEX IF NOT EXISTS "modules_sort_order_idx" ON "modules"("sort_order");
CREATE INDEX IF NOT EXISTS "lessons_module_id_idx" ON "lessons"("module_id");
CREATE INDEX IF NOT EXISTS "lessons_lesson_type_idx" ON "lessons"("lesson_type");
CREATE INDEX IF NOT EXISTS "lessons_status_idx" ON "lessons"("status");
CREATE INDEX IF NOT EXISTS "lessons_sort_order_idx" ON "lessons"("sort_order");
CREATE INDEX IF NOT EXISTS "audit_logs_tenant_id_idx" ON "audit_logs"("tenant_id");
CREATE INDEX IF NOT EXISTS "audit_logs_user_id_idx" ON "audit_logs"("user_id");
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs"("created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_type_idx" ON "audit_logs"("entity_type");

ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("module_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("tenant_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
