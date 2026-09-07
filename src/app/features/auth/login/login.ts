import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  standalone: true,
})
export class Login implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  Login() {
    let email: string | null | undefined = this.loginForm.value.email;
    let password: string | null | undefined = this.loginForm.value.password;


    console.log("data sinding to server : " , this.loginForm.value);

    if (email != null && password != null) {
      this.authService.login(email, password).subscribe({
        next: (data) => {
          console.log("Reponse de server : " , data);
          this.authService.loadProfile(data);
          this.router.navigateByUrl('/admin');
        },
        error: (err) => {
          console.error(err);
          if (err.status === 401 || err.status === 400) {
            console.log("Error Login")
            this.loginForm.setErrors({ invalidCredentials: true });
          }
        },
      });
    }
  }
}
