import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [DashboardController],
  providers: [DashboardService, JwtGuard, PermissionsGuard]
})
export class DashboardModule {}
