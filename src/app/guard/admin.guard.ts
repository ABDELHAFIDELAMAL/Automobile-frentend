import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak-service/keycloak-service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (keycloakService.isAdmin()) {
    return true;
  }

  await keycloakService.refreshUserInfos();

  router.navigate(['/dashboard']);
  return false;
};
