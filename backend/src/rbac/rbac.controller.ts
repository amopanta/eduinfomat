import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
