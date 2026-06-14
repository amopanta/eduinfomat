import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RbacModule } from './rbac/rbac.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, TenantsModule, RbacModule, AuditModule],
  controllers: [HealthController]
})
export class AppModule {}
