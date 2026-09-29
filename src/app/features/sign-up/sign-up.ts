import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  standalone: true,
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {
  private keycloakService = inject(KeycloakService);

  signUpForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignUp() {
    if (this.signUpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const backendSignUpUrl = 'http://localhost:3000/api/auth/register';

    this.http.post(backendSignUpUrl, this.signUpForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
      },
    });
  }

  loginWithGoogle(): void {
    console.log('Login with Google called');
    this.keycloakService.loginWithGoogle();
  }

  loginWithGithub(): void {
    console.log('Login with Github called');
    this.keycloakService.loginWithGithub();
  }

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
