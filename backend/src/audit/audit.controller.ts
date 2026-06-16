import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermission } from '../rbac/permissions.decorator';
import { AuditQuery, AuditService } from './audit.service';

@UseGuards(JwtGuard, PermissionsGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  @RequirePermission('audit.read')
  search(@Query() query: AuditQuery) {
    return this.service.search(query);
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="audit.csv"')
  @RequirePermission('audit.export')
  exportCsv(@Query() query: AuditQuery) {
    return this.service.exportCsv(query);
  }
}
