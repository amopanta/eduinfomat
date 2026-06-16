import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('summary')
  @RequirePermission('dashboard.read')
  summary() {
    return this.service.summary();
  }

  @Get('activity')
  @RequirePermission('dashboard.read')
  activity() {
    return this.service.activity();
  }
}
