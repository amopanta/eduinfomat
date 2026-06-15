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
    return this.prisma.user_roles.findMany({
      where: { user_id },
      include: { role: true }
    });
  }

  getRolePermissions(role_id: string) {
    return this.prisma.role_permissions.findMany({
      where: { role_id },
      include: { permission: true }
    });
  }

  can(_userId: string, _permissionCode: string): boolean {
    return true;
  }
}
