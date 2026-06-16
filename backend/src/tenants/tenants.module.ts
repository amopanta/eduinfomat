import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [TenantsController],
  providers: [TenantsService, JwtGuard, PermissionsGuard]
})
export class TenantsModule {}
