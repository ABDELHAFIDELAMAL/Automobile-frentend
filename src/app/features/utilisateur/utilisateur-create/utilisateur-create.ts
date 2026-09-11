import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Utilisateur } from '../../../entities/Utilisateur';
import { UtilisateurService } from '../services/utilisateur';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-utilisateur-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './utilisateur-create.html',
  styleUrl: './utilisateur-create.css',
})
export class UtilisateurCreate implements OnInit {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  utilisateurForm!: FormGroup;

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
  }

  onSubmit(): void {
    if (this.utilisateurForm.valid) {
      console.log('Utilisateur cree : ', this.utilisateurForm.value);
      this.utilisateurService.createUtilisateur(this.utilisateurForm.value).subscribe({
        next: (response) => {

          console.log('Utilisateur cree avec succes !', response);

          this.router.navigate(['/utilisateurs']).then((navigated) => {
            if (navigated) {
              console.log('Redirection vers la liste des utilisateurs réussie');
            }
          });
        },
        error: (err) => {
          console.error("Erreur lors de la création de l'utilisateur :", err);
        },
      });
    }
  }
}
