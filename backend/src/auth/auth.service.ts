import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    await this.auditService.log({
      action: 'USER_REGISTERED',
      entity_type: 'users',
      tenant_id: user.tenant_id,
      user_id: user.user_id,
      entity_id: user.user_id
    });
    return user;
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

    await this.auditService.log({
      action: 'LOGIN',
      entity_type: 'auth',
      tenant_id: user.tenant_id,
      user_id: user.user_id,
      entity_id: user.user_id
    });

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

  async logout(user?: { sub: string; tenant_id: string }) {
    if (user) {
      await this.auditService.log({
        action: 'LOGOUT',
        entity_type: 'auth',
        tenant_id: user.tenant_id,
        user_id: user.sub,
        entity_id: user.sub
      });
    }
    return { success: true };
  }
}
