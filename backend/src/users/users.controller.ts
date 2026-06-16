import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @RequirePermission('users.read')
  list(@Headers('x-tenant-id') tenantId: string) {
    return this.service.findByTenant(tenantId);
  }

  @Get(':id')
  @RequirePermission('users.read')
  get(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @RequirePermission('users.create')
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @RequirePermission('users.update')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('users.delete')
  remove(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
