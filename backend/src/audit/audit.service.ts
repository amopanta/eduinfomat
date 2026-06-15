import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

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
}
