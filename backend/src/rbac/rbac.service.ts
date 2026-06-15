import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  listRoles() {
    return this.prisma.roles.findMany({ orderBy: { created_at: 'desc' } });
  }

  createRole(data: { code: string; name: string; description?: string }) {
    return this.prisma.roles.create({ data });
  }

  updateRole(role_id: string, data: { name?: string; description?: string }) {
    return this.prisma.roles.update({ where: { role_id }, data });
  }

  async deleteRole(role_id: string) {
    await this.prisma.user_roles.deleteMany({ where: { role_id } });
    await this.prisma.role_permissions.deleteMany({ where: { role_id } });
    return this.prisma.roles.delete({ where: { role_id } });
  }

  listPermissions() {
    return this.prisma.permissions.findMany({ orderBy: { code: 'asc' } });
  }

  async createPermission(data: { code: string; name: string; description?: string }) {
    const permission = await this.prisma.permissions.create({ data });
    await this.prisma.audit_logs.create({
      data: {
        action: 'PERMISSION_CREATED',
        entity_type: 'permissions',
        entity_id: permission.permission_id,
        metadata: { code: permission.code }
      }
    });
    return permission;
  }

  updatePermission(permission_id: string, data: { name?: string; description?: string }) {
    return this.prisma.permissions.update({ where: { permission_id }, data });
  }

  async deletePermission(permission_id: string) {
    await this.prisma.role_permissions.deleteMany({ where: { permission_id } });
    return this.prisma.permissions.delete({ where: { permission_id } });
  }

  async assignPermissionToRole(role_id: string, permission_id: string) {
    const assignment = await this.prisma.role_permissions.create({ data: { role_id, permission_id } });
    await this.prisma.audit_logs.create({
      data: {
        action: 'PERMISSION_ASSIGNED_TO_ROLE',
        entity_type: 'role_permissions',
        entity_id: assignment.role_permission_id,
        metadata: { role_id, permission_id }
      }
    });
    return assignment;
  }

  async removePermissionFromRole(role_id: string, permission_id: string) {
    const removed = await this.prisma.role_permissions.delete({ where: { role_id_permission_id: { role_id, permission_id } } });
    await this.prisma.audit_logs.create({
      data: {
        action: 'PERMISSION_REMOVED_FROM_ROLE',
        entity_type: 'role_permissions',
        entity_id: removed.role_permission_id,
        metadata: { role_id, permission_id }
      }
    });
    return removed;
  }

  async assignRole(user_id: string, role_id: string) {
    const assignment = await this.prisma.user_roles.create({ data: { user_id, role_id } });
    const user = await this.prisma.users.findUnique({ where: { user_id } });
    await this.prisma.audit_logs.create({
      data: {
        action: 'ROLE_ASSIGNED',
        entity_type: 'user_roles',
        tenant_id: user?.tenant_id || null,
        user_id,
        entity_id: assignment.user_role_id,
        metadata: { role_id }
      }
    });
    return assignment;
  }

  getUserRoles(user_id: string) {
    return this.prisma.user_roles.findMany({ where: { user_id }, include: { role: true } });
  }

  getRolePermissions(role_id: string) {
    return this.prisma.role_permissions.findMany({ where: { role_id }, include: { permission: true } });
  }

  can(_userId: string, _permissionCode: string): boolean {
    return true;
  }
}
