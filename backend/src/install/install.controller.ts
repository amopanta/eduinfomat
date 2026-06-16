import { Body, Controller, Get, Post } from '@nestjs/common';
import { SetupInstallDto } from './dto/setup-install.dto';
import { InstallService } from './install.service';

@Controller('install')
export class InstallController {
  constructor(private readonly service: InstallService) {}

  @Get('status')
  status() {
    return this.service.status();
  }

  @Post('setup')
  setup(@Body() dto: SetupInstallDto) {
    return this.service.setup(dto);
  }
}
