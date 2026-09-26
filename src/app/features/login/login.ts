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
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;

      this.keycloakService.login(username, password).subscribe({
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
}
