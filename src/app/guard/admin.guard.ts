import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak-service/keycloak-service';
import { Role } from '../enums/Role.enum';


export const adminGuard: CanActivateFn = () => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  if (keycloak.isLoggedIn() && keycloak.hasRole(Role.ADMIN)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
