import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CustomerOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.role !== 'admin' && request.user?.role !== 'customer' && request.user?.role !== 'platform_admin') {
      throw new ForbiddenException('Access denied. Only customers or administrators can perform this action.');
    }
    return true;
  }
}
