import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../database/prisma.service';
import { REQUIRED_PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado para validar permisos');
    }

    const userRoles = await this.prisma.user_roles.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            role_permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    const permissions = new Set<string>();

    for (const userRole of userRoles) {
      if (userRole.role.code === 'SUPER_ADMIN') {
        return true;
      }

      for (const rolePermission of userRole.role.role_permissions) {
        permissions.add(rolePermission.permission.code);
      }
    }

    const allowed = required.every((permission) => permissions.has(permission));

    if (!allowed) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }
}
