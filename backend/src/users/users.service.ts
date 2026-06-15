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

    return this.prisma.users.create({
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
  }

  update(userId: string, dto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { user_id: userId },
      data: dto,
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        status: true,
        updated_at: true
      }
    });
  }

  deactivate(userId: string) {
    return this.prisma.users.update({
      where: { user_id: userId },
      data: { status: 'inactive' },
      select: { user_id: true, status: true, updated_at: true }
    });
  }
}
