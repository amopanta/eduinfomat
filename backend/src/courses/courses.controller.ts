import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  @RequirePermission('courses.read')
  list(@Headers('x-tenant-id') tenantId: string) {
    return this.service.list(tenantId);
  }

  @Get(':id')
  @RequirePermission('courses.read')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  @RequirePermission('courses.create')
  create(@Body() dto: CreateCourseDto, @Req() req: any) {
    return this.service.create(dto, req.user?.sub);
  }

  @Put(':id')
  @RequirePermission('courses.update')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Req() req: any) {
    return this.service.update(id, dto, req.user?.sub);
  }

  @Delete(':id')
  @RequirePermission('courses.delete')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.deactivate(id, req.user?.sub);
  }
}
