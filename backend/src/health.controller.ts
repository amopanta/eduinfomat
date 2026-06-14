import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      app: 'IF.EDU.INFOMATT API',
      status: 'ok',
      version: '0.1.0-sprint-1',
      timestamp: new Date().toISOString()
    };
  }
}
