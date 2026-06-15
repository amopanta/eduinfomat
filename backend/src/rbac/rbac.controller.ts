import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from './permissions.guard';
import { RequirePermission } from './permissions.decorator';
import { RbacService } from './rbac.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('roles')
export class RbacController {
  constructor(private readonly service: RbacService) {}

  @Get('permissions')
  @RequirePermission('permissions.read')
  listPermissions() {
    return this.service.listPermissions();
  }

  @Post('permissions')
  @RequirePermission('permissions.create')
  createPermission(@Body() body: { code: string; name: string; description?: string }) {
    return this.service.createPermission(body);
  }

  @Put('permissions/:permissionId')
  @RequirePermission('permissions.update')
  updatePermission(@Param('permissionId') permissionId: string, @Body() body: { name?: string; description?: string }) {
    return this.service.updatePermission(permissionId, body);
  }

  @Delete('permissions/:permissionId')
  @RequirePermission('permissions.delete')
  deletePermission(@Param('permissionId') permissionId: string) {
    return this.service.deletePermission(permissionId);
  }

  @Post('assign')
  @RequirePermission('roles.assign')
  assignRole(@Body() body: { user_id: string; role_id: string }) {
    return this.service.assignRole(body.user_id, body.role_id);
  }

  @Get('users/:userId')
  @RequirePermission('roles.read')
  getUserRoles(@Param('userId') userId: string) {
    return this.service.getUserRoles(userId);
  }

  @Get()
  @RequirePermission('roles.read')
  listRoles() {
    return this.service.listRoles();
  }

  @Post()
  @RequirePermission('roles.create')
  createRole(@Body() body: { code: string; name: string; description?: string }) {
    return this.service.createRole(body);
  }

  @Put(':roleId')
  @RequirePermission('roles.update')
  updateRole(@Param('roleId') roleId: string, @Body() body: { name?: string; description?: string }) {
    return this.service.updateRole(roleId, body);
  }

  @Post(':roleId/permissions')
  @RequirePermission('roles.permissions.assign')
  assignPermissionToRole(@Param('roleId') roleId: string, @Body() body: { permission_id: string }) {
    return this.service.assignPermissionToRole(roleId, body.permission_id);
  }

  @Delete(':roleId/permissions/:permissionId')
  @RequirePermission('roles.permissions.remove')
  removePermissionFromRole(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.service.removePermissionFromRole(roleId, permissionId);
  }

  @Get(':roleId/permissions')
  @RequirePermission('roles.read')
  getRolePermissions(@Param('roleId') roleId: string) {
    return this.service.getRolePermissions(roleId);
  }

  @Delete(':roleId')
  @RequirePermission('roles.delete')
  deleteRole(@Param('roleId') roleId: string) {
    return this.service.deleteRole(roleId);
  }
}
