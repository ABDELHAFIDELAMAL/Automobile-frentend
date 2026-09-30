import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../services/keycloak-service/keycloak-service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../entities/ApiResponce';


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
      terms: [false, Validators.requiredTrue]
    });
  }

  onSignUp() {
    if (this.signUpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    console.log("User sent to server : " , this.signUpForm.value);

    this.http.post<ApiResponce<any>>('http://localhost:8090/api/v1/auth/register', this.signUpForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log(response);
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Détail du rejet 400 :', err.error);
        this.errorMessage = err.error?.message || "Registration failed.";
      }
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
