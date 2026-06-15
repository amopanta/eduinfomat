import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RbacService } from './rbac.service';

@Controller('roles')
export class RbacController {
  constructor(private readonly service: RbacService) {}

  @Get()
  listRoles() {
    return this.service.listRoles();
  }

  @Post()
  createRole(@Body() body: { code: string; name: string; description?: string }) {
    return this.service.createRole(body);
  }

  @Post('assign')
  assignRole(@Body() body: { user_id: string; role_id: string }) {
    return this.service.assignRole(body.user_id, body.role_id);
  }

  @Get('users/:userId')
  getUserRoles(@Param('userId') userId: string) {
    return this.service.getUserRoles(userId);
  }

  @Get(':roleId/permissions')
  getRolePermissions(@Param('roleId') roleId: string) {
    return this.service.getRolePermissions(roleId);
  }
}
