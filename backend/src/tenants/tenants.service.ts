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

  create(dto: CreateTenantDto) {
    return this.prisma.tenants.create({ data: dto });
  }

  update(id: string, dto: UpdateTenantDto) {
    return this.prisma.tenants.update({ where: { tenant_id: id }, data: dto });
  }

  deactivate(id: string) {
    return this.prisma.tenants.update({ where: { tenant_id: id }, data: { status: 'inactive' } });
  }
}
