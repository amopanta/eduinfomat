import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller()
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Get('modules/:moduleId/lessons')
  @RequirePermission('lessons.read')
  listByModule(@Param('moduleId') moduleId: string) {
    return this.service.listByModule(moduleId);
  }

  @Get('lessons/:id')
  @RequirePermission('lessons.read')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post('modules/:moduleId/lessons')
  @RequirePermission('lessons.create')
  create(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto, @Req() req: any) {
    return this.service.create(moduleId, dto, req.user?.sub);
  }

  @Put('lessons/:id')
  @RequirePermission('lessons.update')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto, @Req() req: any) {
    return this.service.update(id, dto, req.user?.sub);
  }

  @Delete('lessons/:id')
  @RequirePermission('lessons.delete')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.deactivate(id, req.user?.sub);
  }
}
