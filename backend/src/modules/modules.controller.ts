import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModulesService } from './modules.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller()
export class ModulesController {
  constructor(private readonly service: ModulesService) {}

  @Get('courses/:courseId/modules')
  @RequirePermission('modules.read')
  listByCourse(@Param('courseId') courseId: string) {
    return this.service.listByCourse(courseId);
  }

  @Get('modules/:id')
  @RequirePermission('modules.read')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post('courses/:courseId/modules')
  @RequirePermission('modules.create')
  create(@Param('courseId') courseId: string, @Body() dto: CreateModuleDto, @Req() req: any) {
    return this.service.create(courseId, dto, req.user?.sub);
  }

  @Put('modules/:id')
  @RequirePermission('modules.update')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto, @Req() req: any) {
    return this.service.update(id, dto, req.user?.sub);
  }

  @Delete('modules/:id')
  @RequirePermission('modules.delete')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.deactivate(id, req.user?.sub);
  }
}
