import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

/**
 * Endpoints de usuarios.
 * Sprint 1 usa X-Tenant-ID de forma temporal para pruebas.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list(@Headers('x-tenant-id') tenantId: string) {
    return this.usersService.findByTenant(tenantId);
  }
}
