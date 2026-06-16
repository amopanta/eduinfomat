import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [LessonsController],
  providers: [LessonsService, JwtGuard, PermissionsGuard]
})
export class LessonsModule {}
