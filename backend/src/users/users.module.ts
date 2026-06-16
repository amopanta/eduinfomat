import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, PermissionsGuard],
  exports: [UsersService]
})
export class UsersModule {}
