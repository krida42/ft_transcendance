import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

const devs = ["vbarbier", "sloquet", "skhali", "mvue", "kisikaya"];
export function isDev(login: string): boolean {
  for (let i = 0; i < devs.length; i++) {
    if (login === devs[i])
      return true;
  }
  return false;
}
@Injectable()
export class DeveloperGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const login = user.payload.login;
    console.log("DeveloperGuard: " + login);
    console.log("Is dev: " + isDev(login));
    if (user && isDev(login)) {
      return true;
    }
    return false;
  }
}
