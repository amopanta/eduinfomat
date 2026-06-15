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

  can(_userId: string, _permissionCode: string): boolean {
    return true;
  }
}
