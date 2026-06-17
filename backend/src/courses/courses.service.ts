import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  list(tenantId: string) {
    return this.prisma.courses.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
      include: {
        instructor: { select: { user_id: true, email: true, first_name: true, last_name: true } }
      }
    });
  }

  get(courseId: string) {
    return this.prisma.courses.findUnique({
      where: { course_id: courseId },
      include: {
        instructor: { select: { user_id: true, email: true, first_name: true, last_name: true } },
        tenant: { select: { tenant_id: true, code: true, name: true } }
      }
    });
  }

  async create(dto: CreateCourseDto, actorUserId?: string) {
    const course = await this.prisma.courses.create({
      data: {
        tenant_id: dto.tenant_id,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        instructor_id: dto.instructor_id || null,
        status: dto.status || 'draft'
      }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'COURSE_CREATED',
        entity_type: 'courses',
        tenant_id: course.tenant_id,
        user_id: actorUserId || null,
        entity_id: course.course_id,
        metadata: { code: course.code, name: course.name }
      }
    });

    return course;
  }

  async update(courseId: string, dto: UpdateCourseDto, actorUserId?: string) {
    const course = await this.prisma.courses.update({
      where: { course_id: courseId },
      data: dto
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'COURSE_UPDATED',
        entity_type: 'courses',
        tenant_id: course.tenant_id,
        user_id: actorUserId || null,
        entity_id: course.course_id,
        metadata: { ...dto }
      }
    });

    return course;
  }

  async deactivate(courseId: string, actorUserId?: string) {
    const course = await this.prisma.courses.update({
      where: { course_id: courseId },
      data: { status: 'inactive' }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'COURSE_DEACTIVATED',
        entity_type: 'courses',
        tenant_id: course.tenant_id,
        user_id: actorUserId || null,
        entity_id: course.course_id,
        metadata: { status: course.status }
      }
    });

    return course;
  }
}
