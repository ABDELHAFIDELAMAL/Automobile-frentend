import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../entities/User';
import { UtilisateurService } from '../services/utilisateur';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-utilisateur-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './utilisateur-create.html',
  styleUrl: './utilisateur-create.css',
})
export class UtilisateurCreate implements OnInit {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  utilisateurForm!: FormGroup;
  utilisateurId: number | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.utilisateurForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
      prenom: new FormControl('', [Validators.required, Validators.minLength(3)]),
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
      this.utilisateurId = +idParam;
      this.utilisateurForm.get('password')?.clearValidators();
      this.utilisateurForm.get('password')?.updateValueAndValidity();

      this.utilisateurService.getUtilisateurById(this.utilisateurId).subscribe({
        next: (response) => {
          this.utilisateurForm.patchValue({
            nom: response.data.nom,
            prenom: response.data.prenom,
            email: response.data.email,
            role: response.data.role,
            enabled: response.data.enabled,
          });
        },
        error: (error) => console.error(error),
      });
    }
  }

  onSubmit(): void {
    if (this.utilisateurForm.invalid) {
      this.utilisateurForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const valueForm = this.utilisateurForm.value;

    const utilisateurPayload: any = {
      nom: valueForm.nom,
      prenom: valueForm.prenom,
      email: valueForm.email,
      role: valueForm.role,
      enabled: valueForm.enabled,
    };

    if (valueForm.password) {
      utilisateurPayload.password = valueForm.password;
    }

    if (this.utilisateurId) {
      this.updateUtlisateur(this.utilisateurId, utilisateurPayload);
    } else {
      this.createUtilisateur(utilisateurPayload);
    }
  }

  createUtilisateur(utilisateur: User): void {
    this.utilisateurService.createUtilisateur(utilisateur).subscribe({
      next: (response) => {
        alert('User créé avec succès');
        this.router.navigate(['/utilisateurs']);
      },
      error: (error) => {
        if (
          error.status === 409 ||
          error.error?.message?.includes('déjà') ||
          error.error?.message?.includes('exists')
        ) {
          this.errorMessage = 'Cet utilisateur ou cet email existe déjà !';
          alert(this.errorMessage);
        } else {
          console.log("Erreur lors de la création de l'utilisateur : ", error);
        }
      },
    });
  }

  updateUtlisateur(id: number, utilisateur: User): void {
    this.utilisateurService.updateUtilisateur(id, utilisateur).subscribe({
      next: (response) => {
        alert('User modifié avec succès');
        this.router.navigate(['/utilisateurs']);
      },
      error: (error) => {
        if (
          error.status === 409 || error.status === 500 ||
          error.error?.message?.includes('déjà') ||
          error.error?.message?.includes('exists')
        ) {
          this.errorMessage = 'Cet utilisateur ou cet email existe déjà !';
          alert(this.errorMessage);
        } else {
          console.log("Erreur lors de la modification de l'utilisateur : ", error);
        }
      },
    });
  }
}
