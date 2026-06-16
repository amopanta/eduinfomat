import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InstallController } from './install.controller';
import { InstallService } from './install.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InstallController],
  providers: [InstallService]
})
export class InstallModule {}
