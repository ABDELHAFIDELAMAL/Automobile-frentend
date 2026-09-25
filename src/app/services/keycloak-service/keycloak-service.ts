import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Role } from '../../enums/Role.enum';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'AutomobileRealm',
    clientId: 'AutomobileClient',
  });

  async init(): Promise<boolean> {
    return await this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async logout(): Promise<void> {
    await this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRoles(): string[] {
    const resourceAccess = this.keycloak.tokenParsed?.['resource_access'];
    const clientAccess = resourceAccess?.['AutomobileClient'];
    return clientAccess?.['roles'] ?? [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ADMIN');
  }

  isUser(): boolean {
    return this.getRoles().includes('USER');
  }

  hasRole(role: Role): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }
    return this.keycloak.realmAccess?.roles.includes(role) ?? false;
  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated ?? false;
  }

  getUserInfosSynchronous() {
    if (!this.keycloak.authenticated) return null;

    return {
      id: this.keycloak.subject,
      username: this.keycloak.tokenParsed?.['preferred_username'],
      email: this.keycloak.tokenParsed?.['email'],
      firstName: this.keycloak.tokenParsed?.['given_name'],
      lastName: this.keycloak.tokenParsed?.['family_name'],
    };
  }
}
