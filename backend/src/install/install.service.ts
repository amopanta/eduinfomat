import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { SetupInstallDto } from './dto/setup-install.dto';

@Injectable()
export class InstallService {
  constructor(private readonly prisma: PrismaService) {}

  async status() {
    const [tenantCount, userCount] = await Promise.all([
      this.prisma.tenants.count(),
      this.prisma.users.count()
    ]);

    return {
      installed: tenantCount > 0 || userCount > 0,
      tenant_count: tenantCount,
      user_count: userCount
    };
  }

  async setup(dto: SetupInstallDto) {
    const current = await this.status();

    if (current.installed) {
      throw new BadRequestException('La plataforma ya fue instalada.');
    }

    const password_hash = await bcrypt.hash(dto.admin_password, 10);

    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenants.create({
        data: {
          name: dto.tenant_name,
          code: dto.tenant_code,
          type: 'company',
          status: 'active'
        }
      });

      const superAdminRole = await tx.roles.upsert({
        where: { code: 'SUPER_ADMIN' },
        update: {},
        create: {
          code: 'SUPER_ADMIN',
          name: 'Super Admin',
          description: 'Administrador global'
        }
      });

      const user = await tx.users.create({
        data: {
          tenant_id: tenant.tenant_id,
          email: dto.admin_email,
          password_hash,
          first_name: dto.admin_first_name,
          last_name: dto.admin_last_name,
          status: 'active'
        },
        select: {
          user_id: true,
          tenant_id: true,
          email: true,
          first_name: true,
          last_name: true,
          status: true,
          created_at: true
        }
      });

      await tx.user_roles.create({
        data: {
          user_id: user.user_id,
          role_id: superAdminRole.role_id
        }
      });

      await tx.audit_logs.create({
        data: {
          action: 'INSTALL_COMPLETED',
          entity_type: 'install',
          tenant_id: tenant.tenant_id,
          user_id: user.user_id,
          entity_id: tenant.tenant_id,
          metadata: {
            tenant_code: tenant.code,
            admin_email: user.email
          }
        }
      });

      return {
        installed: true,
        tenant,
        admin_user: user
      };
    });
  }
}
