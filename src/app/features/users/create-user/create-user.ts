import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../entities/User';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  userForm!: FormGroup;
  userId: number | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      role: new FormControl('', [Validators.required]),
      enabled: new FormControl(true),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      this.userService.getUserById(this.userId).subscribe({
        next: (response) => {
          this.userForm.patchValue({
            nom: response.data.lastName,
            prenom: response.data.firstName,
            email: response.data.email,
            role: response.data.roles,
            enabled: response.data.enabled,
          });
        },
        error: (error) => console.error(error),
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const valueForm = this.userForm.value;

    const userPayload: any = {
      lastName: valueForm.lastName,
      firstName: valueForm.firstName,
      email: valueForm.email,
      role: valueForm.role,
      enabled: valueForm.enabled,
    };

    if (valueForm.password) {
      userPayload.password = valueForm.password;
    }

    if (this.userId) {
      this.updateUser(this.userId, userPayload);
    } else {
      this.createUser(userPayload);
    }
  }

  createUser(utilisateur: User): void {
    this.userService.createUser(utilisateur).subscribe({
      next: (response) => {
        alert('User created succefull');
        this.router.navigate(['/users']);
      },
      error: (error) => {
        if (
          error.status === 409 ||
          error.error?.message?.includes('AllReady') ||
          error.error?.message?.includes('exist')
        ) {
          this.errorMessage = 'this user or email allready exists !';
          alert(this.errorMessage);
        } else {
          console.log("Erreur created user : ", error);
        }
      },
    });
  }

  updateUser(id: number, utilisateur: User): void {
    this.userService.updateUser(id, utilisateur).subscribe({
      next: (response) => {
        alert('User updated succefull');
        this.router.navigate(['/users']);
      },
      error: (error) => {
        if (
          error.status === 409 || error.status === 500 ||
          error.error?.message?.includes('AllReady') ||
          error.error?.message?.includes('exists')
        ) {
          this.errorMessage = 'this user allreay exists !';
          alert(this.errorMessage);
        } else {
          console.log("Erreur update user : ", error);
        }
      },
    });
  }
}
