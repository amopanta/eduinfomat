import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type AuditQuery = {
  page?: string;
  limit?: string;
  action?: string;
  entity_type?: string;
  tenant_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(data: {
    action: string;
    entity_type: string;
    tenant_id?: string | null;
    user_id?: string | null;
    entity_id?: string | null;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.audit_logs.create({
      data: {
        action: data.action,
        entity_type: data.entity_type,
        tenant_id: data.tenant_id || null,
        user_id: data.user_id || null,
        entity_id: data.entity_id || null,
        metadata: data.metadata || {}
      }
    });
  }

  private buildWhere(query: AuditQuery): Prisma.audit_logsWhereInput {
    const where: Prisma.audit_logsWhereInput = {};

    if (query.action) where.action = { contains: query.action, mode: 'insensitive' };
    if (query.entity_type) where.entity_type = { contains: query.entity_type, mode: 'insensitive' };
    if (query.tenant_id) where.tenant_id = query.tenant_id;
    if (query.user_id) where.user_id = query.user_id;

    if (query.date_from || query.date_to) {
      where.created_at = {};
      if (query.date_from) where.created_at.gte = new Date(query.date_from);
      if (query.date_to) where.created_at.lte = new Date(query.date_to);
    }

    return where;
  }

  async search(query: AuditQuery) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const where = this.buildWhere(query);

    const [items, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { email: true, first_name: true, last_name: true } },
          tenant: { select: { name: true, code: true } }
        }
      }),
      this.prisma.audit_logs.count({ where })
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async exportCsv(query: AuditQuery) {
    const where = this.buildWhere(query);
    const rows = await this.prisma.audit_logs.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: 5000,
      include: {
        user: { select: { email: true } },
        tenant: { select: { code: true } }
      }
    });

    const header = ['created_at', 'action', 'entity_type', 'entity_id', 'tenant', 'user', 'metadata'];
    const lines = rows.map((row) => [
      row.created_at.toISOString(),
      row.action,
      row.entity_type,
      row.entity_id || '',
      row.tenant?.code || row.tenant_id || '',
      row.user?.email || row.user_id || '',
      JSON.stringify(row.metadata || {})
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','));

    return [header.join(','), ...lines].join('\n');
  }
}
