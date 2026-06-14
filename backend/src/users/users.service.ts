import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * UsersService centraliza operaciones de usuarios.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  findByTenant(tenantId: string) {
    return this.prisma.users.findMany({
      where: { tenant_id: tenantId },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        created_at: true
      }
    });
  }
}
