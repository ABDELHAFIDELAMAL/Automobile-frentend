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

    if (localToken && localRefreshToken) {
      try {
        return await this.keycloak.init({
          onLoad: 'check-sso',
          token: localToken,
          refreshToken: localRefreshToken,
          checkLoginIframe: false,
        });
      } catch (e) {
        this.logout();
        return false;
      }
    }

    try {
      return await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      });
    } catch (e) {
      return false;
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token || localStorage.getItem('access_token') || undefined;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    await this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
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
    const payload = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<any>(this.keycloakTokenUrl, payload.toString(), { headers }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        this.keycloak
          .init({
            token: response.access_token,
            refreshToken: response.refresh_token,
            checkLoginIframe: false,
          })
          .then(() => {
            this.router.navigate(['/dashboard']);
          })
          .catch(() => {
            this.router.navigate(['/dashboard']);
          });
      }),
    );
  }
}
