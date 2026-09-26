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

  private keycloakLoginUrl =
    'http://localhost:8080/realms/AutomobileRealm/protocol/openid-connect/auth?client_id=AutomobileClient&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F&state=977d5ae5-194b-411a-9971-13acd5b8c965&response_mode=fragment&response_type=code&scope=openid&nonce=824c1db7-485b-405b-8cf5-c3c100cd9fb3&code_challenge=j1Ric7EHohvprOxoEZ-9ppfe_dZ-VjurrKoruZGH6Fs&code_challenge_method=S256';
  private clientId = 'AutomobileClient';

  private http = inject(HttpClient);
  private router = inject(Router);

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

  login(username: string, password: string): Observable<any> {
    const payload = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post<any>(this.keycloakLoginUrl, payload.toString(), { headers }).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }
}
