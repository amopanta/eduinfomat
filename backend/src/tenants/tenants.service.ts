import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.tenants.findMany();
  }

  get(id: string) {
    return this.prisma.tenants.findUnique({ where: { tenant_id: id } });
  }

  async create(dto: CreateTenantDto) {
    const tenant = await this.prisma.tenants.create({ data: dto });
    await this.prisma.audit_logs.create({
      data: {
        action: 'TENANT_CREATED',
        entity_type: 'tenants',
        tenant_id: tenant.tenant_id,
        entity_id: tenant.tenant_id,
        metadata: { code: tenant.code }
      }
    });
    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenants.update({ where: { tenant_id: id }, data: dto });
    await this.prisma.audit_logs.create({
      data: {
        action: 'TENANT_UPDATED',
        entity_type: 'tenants',
        tenant_id: tenant.tenant_id,
        entity_id: tenant.tenant_id,
        metadata: {
          name: dto.name || null,
          status: dto.status || null,
          type: dto.type || null
        }
      }
    });
    return tenant;
  }

  async deactivate(id: string) {
    const tenant = await this.prisma.tenants.update({ where: { tenant_id: id }, data: { status: 'inactive' } });
    await this.prisma.audit_logs.create({
      data: {
        action: 'TENANT_DELETED',
        entity_type: 'tenants',
        tenant_id: tenant.tenant_id,
        entity_id: tenant.tenant_id,
        metadata: { status: tenant.status }
      }
    });
    return tenant;
  }
}
