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
  private manualTokenParsed: any = null;

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
        this.manualTokenParsed = this.decodeToken(localToken);
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

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
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
        this.manualTokenParsed = this.keycloak.tokenParsed;
        return;
      } catch (e) {}
    }
    this.setFallbackUserInfos();
  }

  private setFallbackUserInfos(): void {
    const token = this.getToken();
    if (token) {
      const parsed = this.manualTokenParsed || this.decodeToken(token);
      this.manualTokenParsed = parsed;
      if (parsed) {
        this.currentUser.set({
          id: parsed.sub,
          username: parsed.preferred_username,
          email: parsed.email,
          firstName: parsed.given_name,
          lastName: parsed.family_name,
        });
        return;
      }
    }
    this.currentUser.set(null);
  }

  getToken(): string | undefined {
    return this.keycloak.token || localStorage.getItem('access_token') || undefined;
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.manualTokenParsed = null;
  }

  getUsername(): string | undefined {
    return this.currentUser()?.username;
  }

  getRoles(): string[] {
    const tokenParsed = this.manualTokenParsed || this.keycloak.tokenParsed;
    if (!tokenParsed) return [];

    const realmRoles: string[] = tokenParsed['realm_access']?.['roles'] ?? [];
    const resourceAccess = tokenParsed['resource_access'];
    const clientRoles: string[] = resourceAccess?.[this.clientId]?.['roles'] ?? [];

    return Array.from(new Set([...realmRoles, ...clientRoles]));
  }

  hasRole(role: Role | string): boolean {
    if (!this.isLoggedIn()) return false;
    const userRoles = this.getRoles();
    const targetRole = String(role);
    const cleanRole = targetRole.replace(/^ROLE_/, '');

    return userRoles.some((r) => r === targetRole || r === cleanRole || r === `ROLE_${cleanRole}`);
  }

  isAdmin(): boolean {
    return (
      this.hasRole('ROLE_MANAGER') ||
      this.hasRole('MANAGER') ||
      this.hasRole('ADMIN') ||
      this.hasRole('ROLE_ADMIN')
    );
  }

  isUser(): boolean {
    return this.hasRole('ROLE_USER') || this.hasRole('USER');
  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated || !!localStorage.getItem('access_token');
  }

  getUserInfosSynchronous() {
    return this.currentUser();
  }

  login(username: string, password: string, rememberMe: boolean = false): Observable<any> {
    const payload = new URLSearchParams();
    payload.set('client_id', this.clientId);
    payload.set('grant_type', 'password');
    payload.set('username', username);
    payload.set('password', password);
    payload.set('scope', 'openid');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    if (rememberMe) {
      payload.set('scope', 'openid offline_access');
    } else {
      payload.set('scope', 'openid');
    }

    return this.http.post<any>(this.keycloakTokenUrl, payload.toString(), { headers }).pipe(
      tap(async (response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.keycloak.token = response.access_token;
        this.keycloak.refreshToken = response.refresh_token;
        this.manualTokenParsed = this.decodeToken(response.access_token);
        await this.refreshUserInfos();
        await this.router.navigate(['/dashboard']);
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
      redirectUri: window.location.origin + '/sign-in',
    });
  }

  loginWithGithub() {
    this.keycloak.login({
      idpHint: 'github',
      redirectUri: window.location.origin + '/dashboard',
    });
  }
}
