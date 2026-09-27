import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Role } from '../../enums/Role.enum';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'AutomobileRealm',
    clientId: 'AutomobileClient',
  });

  private keycloakTokenUrl =
    'http://localhost:8080/realms/AutomobileRealm/protocol/openid-connect/token';
  private clientId = 'AutomobileClient';

  private http = inject(HttpClient);
  private router = inject(Router);

  async init(): Promise<boolean> {
    const localToken = localStorage.getItem('access_token');
    const localRefreshToken = localStorage.getItem('refresh_token');

    try {
      const options: Keycloak.KeycloakInitOptions = {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      };

      if (localToken && localRefreshToken) {
        options.token = localToken;
        options.refreshToken = localRefreshToken;
      }

      const authenticated = await this.keycloak.init(options);

      if (!authenticated && localToken) {
        this.clearLocalStorage();
      }

      return authenticated;
    } catch (e) {
      this.clearLocalStorage();
      return false;
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token || localStorage.getItem('access_token') || undefined;
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getRoles(): string[] {
    const resourceAccess = this.keycloak.tokenParsed?.['resource_access'];
    const clientAccess = resourceAccess?.[this.clientId];
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
    return this.keycloak.authenticated || !!localStorage.getItem('access_token');
  }

  getUserInfosSynchronous() {
    if (!this.isLoggedIn()) return null;

    return {
      id: this.keycloak.subject,
      username: this.keycloak.tokenParsed?.['preferred_username'],
      email: this.keycloak.tokenParsed?.['email'],
      firstName: this.keycloak.tokenParsed?.['given_name'],
      lastName: this.keycloak.tokenParsed?.['family_name'],
    };
  }

  login(username: string, password: string): Observable<any> {
    const payload = new URLSearchParams();
    payload.set('client_id', this.clientId);
    payload.set('grant_type', 'password');
    payload.set('username', username);
    payload.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<any>(this.keycloakTokenUrl, payload.toString(), { headers }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        this.keycloak.token = response.access_token;
        this.keycloak.refreshToken = response.refresh_token;

        this.router.navigate(['/dashboard']);
      }),
    );
  }

  loginWithGoogle(): void {
    this.keycloak.login({
      idpHint: 'google',
      redirectUri: window.location.origin + '/dashboard',
    });
  }

  async logout(): Promise<void> {
    this.clearLocalStorage();
    await this.keycloak.logout({
      redirectUri: window.location.origin + '/login',
    });
  }
}
