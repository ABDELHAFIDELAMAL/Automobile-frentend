import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
})
export class Login {
  private keycloakService = inject(KeycloakService);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe : new FormControl(false)
  });

  errorMessage: string = '';
  isLoading: boolean = false;






  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;
      const rememberMe = this.loginForm.value.rememberMe!;

      this.keycloakService.login(username, password , rememberMe).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Username or Password incorrect.';
          console.error('Login error:', err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithGoogle(): void {
    this.keycloakService.loginWithGoogle();
  }
  loginWithFacebook(): void {
    this.keycloakService.loginWithFacebook();
  }
}
