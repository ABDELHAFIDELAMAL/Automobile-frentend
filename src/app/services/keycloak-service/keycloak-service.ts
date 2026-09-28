import { inject, Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Role } from '../../enums/Role.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  currentUser = signal<any>(null);

  constructor() {
    this.keycloak.onAuthSuccess = async () => {
      await this.refreshUserInfos();
    };
    this.keycloak.onAuthRefreshSuccess = async () => {
      await this.refreshUserInfos();
    };
  }

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

      if (authenticated || this.keycloak.authenticated) {
        await this.refreshUserInfos();
        return true;
      } else if (localToken) {
        this.clearLocalStorage();
      }

      return authenticated;
    } catch (e) {
      this.clearLocalStorage();
      return false;
    }
  }

  async refreshUserInfos(): Promise<void> {
    if (this.keycloak.authenticated) {
      try {
        const profile = await this.keycloak.loadUserProfile();
        this.currentUser.set({
          id: this.keycloak.subject,
          username: profile.username || this.keycloak.tokenParsed?.['preferred_username'],
          email: profile.email || this.keycloak.tokenParsed?.['email'],
          firstName: profile.firstName || this.keycloak.tokenParsed?.['given_name'],
          lastName: profile.lastName || this.keycloak.tokenParsed?.['family_name'],
        });
      } catch (e) {
        this.setFallbackUserInfos();
      }
    } else {
      this.setFallbackUserInfos();
    }
  }

  private setFallbackUserInfos(): void {
    if (this.isLoggedIn()) {
      const tokenParsed = this.keycloak.tokenParsed;
      this.currentUser.set({
        id: this.keycloak.subject,
        username: tokenParsed?.['preferred_username'],
        email: tokenParsed?.['email'],
        firstName: tokenParsed?.['given_name'],
        lastName: tokenParsed?.['family_name'],
      });
    } else {
      this.currentUser.set(null);
    }
  }

  getToken(): string | undefined {
    return this.keycloak.token || localStorage.getItem('access_token') || undefined;
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
  }

  getUsername(): string | undefined {
    return this.currentUser()?.username;
  }

  getRoles(): string[] {
    const resourceAccess = this.keycloak.tokenParsed?.['resource_access'];
    const clientAccess = resourceAccess?.[this.clientId];
    return clientAccess?.['roles'] ?? [];
  }

  isAdmin(): boolean {
    if (!this.isLoggedIn()) return false;
    return this.getRoles().includes('ADMIN');
  }

  isUser(): boolean {
    if (!this.isLoggedIn()) return false;
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
    return this.currentUser();
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
      tap(async (response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        this.keycloak.token = response.access_token;
        this.keycloak.refreshToken = response.refresh_token;

        try {
          (this.keycloak as any).processTokenObject(response);
        } catch (e) {}

        await this.refreshUserInfos();
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
