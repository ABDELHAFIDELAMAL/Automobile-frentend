import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionService } from '../services/intervention';
import { Intervention } from '../../../entities/Interventions';

@Component({
  selector: 'app-intervention-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './intervention-create.html',
  styleUrl: './intervention-create.css',
})
export class InterventionCreate implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly interventionsService = inject(InterventionService);

  interventionForm!: FormGroup;
  interventionId?: number;
  vehiculeId = signal<number | null>(null);

  private initForm(): void {
    const dateDuJour = new Date().toISOString().split('T')[0];

    this.interventionForm = new FormGroup({
      vehicule: new FormControl(this.vehiculeId(), [Validators.required]),
      mecanicien: new FormControl(null),
      historique: new FormControl([]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),
      status: new FormControl('RECUE', [Validators.required]),
      priorite: new FormControl('', [Validators.required]),
      coutEstime: new FormControl(0, [Validators.required, Validators.min(0)]),
      dateDepot: new FormControl(dateDuJour, [Validators.required]),
      dateRestitutionPrevue: new FormControl('', [Validators.required]),
      dateCloture: new FormControl(''),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehiculeId.set(+id);
    } else {
      alert("Erreur : Aucun véhicule n'a été spécifié dans l'URL.");
      this.router.navigate(['/vehicules']);
      return;
    }
    this.initForm();
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.value;
    const parsedCoutEstime = formValue.coutEstime
      ? parseFloat(formValue.coutEstime.toString())
      : 0.0;

    // Reconstruction propre du JSON avec des valeurs par défaut pour les types primitifs
    const interventionPayload: any = {
      vehicule: {
        id: Number(this.vehiculeId() || formValue.vehicule),
        clientFictif: false, // Évite le crash si Spring Boot inspecte l'objet véhicule complet
      },
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic || null,
      status: formValue.status,
      priorite: formValue.priorite,
      coutEstime: isNaN(parsedCoutEstime) ? 0.0 : parsedCoutEstime,
      dateDepot: formValue.dateDepot ? `${formValue.dateDepot}T00:00:00` : null,
      dateRestitutionPrevue: formValue.dateRestitutionPrevue
        ? `${formValue.dateRestitutionPrevue}T00:00:00`
        : null,
    };

    if (formValue.mecanicien) {
      interventionPayload.mecanicien = { id: Number(formValue.mecanicien) };
    }

    if (formValue.dateCloture) {
      interventionPayload.dateCloture = `${formValue.dateCloture}T00:00:00`;
    }

    if (this.interventionId) {
      this.updateIntervention(this.interventionId, interventionPayload);
    } else {
      this.createIntervention(interventionPayload);
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.interventionForm.patchValue({
            ...response.data,
            vehicule: response.data.vehicule?.id,
            mecanicien: response.data.mecanicien?.id,
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response) => {
        console.log('Intervention sent to server : ', this.interventionForm.value);
        alert(response.message || 'Intervention créée avec succès !');
        this.router.navigate(['/vehicules/details', this.vehiculeId()]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response) => {
        alert(response.message || 'Intervention mise à jour !');
        this.router.navigate(['/vehicules/details', this.vehiculeId()]);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
