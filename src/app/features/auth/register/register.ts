import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../service/auth-service';
import { disabled } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, NgIf, ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {

  RegisterForm = new FormGroup({
    nom: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    prenom: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
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

  register() {
    let nom = this.RegisterForm.value.nom;
    let prenom = this.RegisterForm.value.prenom;
    let email = this.RegisterForm.value.email;
    let password = this.RegisterForm.value.password;

    if (nom != null && prenom != null && email != null && password != null) {
      this.authService.register(nom, prenom, email, password).subscribe({
        next: (value) => {
          console.log(value);
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          if (err.status === 400) {
            const emailControl = this.RegisterForm.get('email');
            emailControl?.setErrors({ emailExists: true });
          }
        },
      });
    }
  }
}
