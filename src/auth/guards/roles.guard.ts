import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface JwtUser {
  id: number;
  name: string;
  roles?: Role[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    const user = request.user;

    console.log('🛡 Required roles:', requiredRoles);
    console.log('🧑‍💻 User roles:', user.roles);

    return requiredRoles.some((role) =>
      user.roles?.some((r) => r.toUpperCase() === role.toUpperCase()),
    );
  }
}
