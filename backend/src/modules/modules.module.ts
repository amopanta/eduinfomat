import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from '../auth/jwt.guard';
import { DatabaseModule } from '../database/database.module';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [ModulesController],
  providers: [ModulesService, JwtGuard, PermissionsGuard]
})
export class ModulesModule {}
