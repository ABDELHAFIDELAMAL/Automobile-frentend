import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {

  private keycloakService = inject(KeycloakService);

  loginWithGoogle(): void {
    console.log('Login with Google called');
    this.keycloakService.loginWithGoogle();
  }

  loginWithGithub(): void {
    console.log('Login with Github called');
    this.keycloakService.loginWithGithub();
  }
}
