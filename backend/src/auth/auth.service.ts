import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    return this.usersService.create(dto);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      tenant_id: user.tenant_id
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      token_type: 'Bearer',
      user: {
        id: user.user_id,
        email: user.email,
        tenant_id: user.tenant_id
      }
    };
  }

  async refresh(user: { sub: string; email: string; tenant_id: string }) {
    const payload = {
      sub: user.sub,
      email: user.email,
      tenant_id: user.tenant_id
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer'
    };
  }

  logout() {
    return { success: true };
  }
}
