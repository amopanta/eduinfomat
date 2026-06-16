import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [users, courses, modules, lessons] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.courses.count(),
      this.prisma.modules.count(),
      this.prisma.lessons.count()
    ]);

    return { users, courses, modules, lessons };
  }

  activity() {
    return this.prisma.audit_logs.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        audit_id: true,
        action: true,
        entity_type: true,
        entity_id: true,
        created_at: true,
        user: { select: { email: true, first_name: true, last_name: true } },
        tenant: { select: { code: true, name: true } }
      }
    });
  }
}
