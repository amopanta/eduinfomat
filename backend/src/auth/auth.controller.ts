import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtGuard)
  @Post('refresh')
  refresh(@CurrentUser() user: { sub: string; email: string; tenant_id: string }) {
    return this.authService.refresh(user);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@CurrentUser() user: { sub: string; tenant_id: string }) {
    return this.authService.logout(user);
  }
}
