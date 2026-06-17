import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  listByCourse(courseId: string) {
    return this.prisma.modules.findMany({
      where: { course_id: courseId },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }]
    });
  }

  get(moduleId: string) {
    return this.prisma.modules.findUnique({
      where: { module_id: moduleId },
      include: { course: { select: { course_id: true, tenant_id: true, code: true, name: true } } }
    });
  }

  async create(courseId: string, dto: CreateModuleDto, actorUserId?: string) {
    const course = await this.prisma.courses.findUnique({ where: { course_id: courseId } });
    const module = await this.prisma.modules.create({
      data: {
        course_id: courseId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        sort_order: dto.sort_order || 0,
        status: dto.status || 'draft'
      }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'MODULE_CREATED',
        entity_type: 'modules',
        tenant_id: course?.tenant_id || null,
        user_id: actorUserId || null,
        entity_id: module.module_id,
        metadata: { course_id: courseId, code: module.code, name: module.name }
      }
    });

    return module;
  }

  async update(moduleId: string, dto: UpdateModuleDto, actorUserId?: string) {
    const module = await this.prisma.modules.update({
      where: { module_id: moduleId },
      data: dto,
      include: { course: { select: { tenant_id: true } } }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'MODULE_UPDATED',
        entity_type: 'modules',
        tenant_id: module.course.tenant_id,
        user_id: actorUserId || null,
        entity_id: module.module_id,
        metadata: { ...dto }
      }
    });

    return module;
  }

  async deactivate(moduleId: string, actorUserId?: string) {
    const module = await this.prisma.modules.update({
      where: { module_id: moduleId },
      data: { status: 'inactive' },
      include: { course: { select: { tenant_id: true } } }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'MODULE_DEACTIVATED',
        entity_type: 'modules',
        tenant_id: module.course.tenant_id,
        user_id: actorUserId || null,
        entity_id: module.module_id,
        metadata: { status: module.status }
      }
    });

    return module;
  }
}
