import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RbacModule } from './rbac/rbac.module';
import { AuditModule } from './audit/audit.module';
import { InstallModule } from './install/install.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [DatabaseModule, InstallModule, AuthModule, UsersModule, TenantsModule, RbacModule, AuditModule, CoursesModule, ModulesModule, LessonsModule],
  controllers: [HealthController]
})
export class AppModule {}
