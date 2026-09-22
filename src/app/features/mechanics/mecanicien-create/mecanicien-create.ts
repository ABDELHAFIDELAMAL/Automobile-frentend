import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Specialite } from '../../../enums/Specialty.enum';
import { NgIf } from '@angular/common';
import { Mecanicien } from '../../../entities/Mechanic';
import { MecanicienService } from '../services/mecanicien';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-mecanicien-create',
  styleUrl: './mecanicien-create.css',
  templateUrl: './mecanicien-create.html',
  standalone: true,
})
export class MecanicienCreate implements OnInit {
  Specialite = Specialite;

  mecanicienService = inject(MecanicienService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  mecanicienId: number | null = null;

  MecanicienForm = new FormGroup({
    nom: new FormControl('', [Validators.required]),
    specialite: new FormControl('', [Validators.required]),
    disponible: new FormControl(true),
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.mecanicienId = +idParam;

      this.mecanicienService.getMecanicienById(this.mecanicienId).subscribe({
        next: (response) => {
          this.MecanicienForm.patchValue({
            nom: response.data.nom,
            specialite: response.data.specialite,
            disponible: response.data.disponible,
          });
        },
        error: (error) => console.error('Erreur de chargement', error),
      });
    }
  }

  onSubmit(): void {
    if (this.MecanicienForm.invalid) {
      this.MecanicienForm.markAllAsTouched();
      return;
    }

    const formValue = this.MecanicienForm.value;

    const mecanicienPayload: any = {
      nom: formValue.nom,
      specialite: formValue.specialite,
      disponible: formValue.disponible,
    };

    if (this.mecanicienId) {
      this.updateMecanicien(this.mecanicienId, mecanicienPayload);
    } else {
      this.createMecanicien(mecanicienPayload);
    }
  }

  createMecanicien(mecanicien: Mecanicien): void {
    this.mecanicienService.createMecanicien(mecanicien).subscribe({
      next: (response) => {
        alert('Mécanicien créé avec succès !');
        this.router.navigate(['/mecaniciens']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateMecanicien(id: number, mecanicien: Mecanicien): void {
    this.mecanicienService.updateMecanicien(id, mecanicien).subscribe({
      next: (response) => {
        alert('Mecancien updated successfully');
        this.router.navigate(['/mecaniciens']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
