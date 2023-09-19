import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
// A FAIRE : Créer un service d'authentification et de gestion des rôles
@Injectable()
export class DeveloperGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Supposons que l'utilisateur contienne des informations sur le rôle de l'utilisateur.

    // Votre logique de vérification ici, par exemple, vérifier si l'utilisateur est un développeur.
    if (user && user.role === 'developer') {
      return true;
    }

    return false;
  }
}
