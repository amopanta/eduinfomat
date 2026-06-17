import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  listByModule(moduleId: string) {
    return this.prisma.lessons.findMany({
      where: { module_id: moduleId },
      orderBy: [{ sort_order: 'asc' }, { created_at: 'asc' }]
    });
  }

  get(lessonId: string) {
    return this.prisma.lessons.findUnique({
      where: { lesson_id: lessonId },
      include: {
        module: {
          select: {
            module_id: true,
            course_id: true,
            code: true,
            name: true,
            course: { select: { tenant_id: true, course_id: true, code: true, name: true } }
          }
        }
      }
    });
  }

  async create(moduleId: string, dto: CreateLessonDto, actorUserId?: string) {
    const module = await this.prisma.modules.findUnique({
      where: { module_id: moduleId },
      include: { course: { select: { tenant_id: true } } }
    });

    const lesson = await this.prisma.lessons.create({
      data: {
        module_id: moduleId,
        code: dto.code,
        name: dto.name,
        lesson_type: dto.lesson_type,
        content: dto.content,
        sort_order: dto.sort_order || 0,
        status: dto.status || 'draft'
      }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'LESSON_CREATED',
        entity_type: 'lessons',
        tenant_id: module?.course.tenant_id || null,
        user_id: actorUserId || null,
        entity_id: lesson.lesson_id,
        metadata: { module_id: moduleId, code: lesson.code, name: lesson.name, lesson_type: lesson.lesson_type }
      }
    });

    return lesson;
  }

  async update(lessonId: string, dto: UpdateLessonDto, actorUserId?: string) {
    const lesson = await this.prisma.lessons.update({
      where: { lesson_id: lessonId },
      data: dto,
      include: { module: { include: { course: { select: { tenant_id: true } } } } }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'LESSON_UPDATED',
        entity_type: 'lessons',
        tenant_id: lesson.module.course.tenant_id,
        user_id: actorUserId || null,
        entity_id: lesson.lesson_id,
        metadata: { ...dto }
      }
    });

    return lesson;
  }

  async deactivate(lessonId: string, actorUserId?: string) {
    const lesson = await this.prisma.lessons.update({
      where: { lesson_id: lessonId },
      data: { status: 'inactive' },
      include: { module: { include: { course: { select: { tenant_id: true } } } } }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'LESSON_DEACTIVATED',
        entity_type: 'lessons',
        tenant_id: lesson.module.course.tenant_id,
        user_id: actorUserId || null,
        entity_id: lesson.lesson_id,
        metadata: { status: lesson.status }
      }
    });

    return lesson;
  }
}
