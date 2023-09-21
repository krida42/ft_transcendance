import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
// A FAIRE : Créer un service d'authentification et de gestion des rôles
@Injectable()
export class DeveloperGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const login = user.payload.login;
    if (user && login === 'vbarbier') {
      return true;
    }

    return false;
  }
}
