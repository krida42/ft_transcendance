import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export function isDev(roles: Array<string>): boolean {
  if (roles.includes('dev')) 
    return true;
  return false;
}
@Injectable()
export class DeveloperGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const roles = user.payload.roles;
    console.log("Is dev: " + isDev(roles));
    if (user && isDev(roles))
      return true;
    return false;
  }
}
