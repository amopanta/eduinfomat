import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  findById(userId: string) {
    return this.prisma.users.findUnique({ where: { user_id: userId } });
  }

  findByTenant(tenantId: string) {
    return this.prisma.users.findMany({
      where: { tenant_id: tenantId },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        created_at: true
      }
    });
  }

  async create(dto: CreateUserDto) {
    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        tenant_id: dto.tenant_id,
        email: dto.email,
        password_hash,
        first_name: dto.first_name,
        last_name: dto.last_name
      },
      select: {
        user_id: true,
        tenant_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        created_at: true
      }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'USER_CREATED',
        entity_type: 'users',
        tenant_id: user.tenant_id,
        user_id: user.user_id,
        entity_id: user.user_id,
        metadata: { email: user.email }
      }
    });

    return user;
  }

  async update(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { user_id: userId },
      data: dto,
      select: {
        user_id: true,
        tenant_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        updated_at: true
      }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'USER_UPDATED',
        entity_type: 'users',
        tenant_id: user.tenant_id,
        user_id: user.user_id,
        entity_id: user.user_id,
        metadata: {
          first_name: dto.first_name || null,
          last_name: dto.last_name || null,
          status: dto.status || null
        }
      }
    });

    return user;
  }

  async deactivate(userId: string) {
    const user = await this.prisma.users.update({
      where: { user_id: userId },
      data: { status: 'inactive' },
      select: { user_id: true, tenant_id: true, status: true, updated_at: true }
    });

    await this.prisma.audit_logs.create({
      data: {
        action: 'USER_DELETED',
        entity_type: 'users',
        tenant_id: user.tenant_id,
        user_id: user.user_id,
        entity_id: user.user_id,
        metadata: { status: user.status }
      }
    });

    return user;
  }
}
