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
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    const isUpdateRoute = this.router.url.includes('/update');

    if (idParam) {
      if (isUpdateRoute) {
        this.interventionId = +idParam;
        this.loadInterventionDetails(this.interventionId);
      } else {
        const parsedId = +idParam;
        this.vehiculeId.set(parsedId);
        this.interventionForm.get('vehicule')?.setValue(parsedId);
      }
    } else {
      alert("Erreur : Aucun identifiant n'a été spécifié dans l'URL.");
      this.router.navigate(['/vehicules']);
    }
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.value;
    const currentVehiculeId = this.vehiculeId() || formValue.vehicule;

    if (!currentVehiculeId) {
      alert("Erreur : Aucun véhicule n'est associé à cette intervention.");
      return;
    }

    const parsedCoutEstime = formValue.coutEstime
      ? parseFloat(formValue.coutEstime.toString())
      : 0.0;

    const interventionPayload: any = {
      vehicule: {
        id: Number(currentVehiculeId),
        clientFictif: false,
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
        if (response?.data) {
          const idVehicule = response.data.vehicule?.id ? Number(response.data.vehicule.id) : null;

          if (idVehicule) {
            this.vehiculeId.set(idVehicule);
            this.interventionForm.get('vehicule')?.setValue(idVehicule);
          }

          const formatDateForInput = (dateValue: any): string => {
            if (!dateValue) return '';
            if (typeof dateValue === 'string') {
              return dateValue.split('T')[0];
            }
            if (dateValue instanceof Date) {
              return dateValue.toISOString().split('T')[0];
            }
            return '';
          };

          this.interventionForm.patchValue({
            ...response.data,
            vehicule: idVehicule,
            mecanicien: response.data.mecanicien?.id || null,
            dateDepot: formatDateForInput(response.data.dateDepot),
            dateRestitutionPrevue: formatDateForInput(response.data.dateRestitutionPrevue),
            dateCloture: formatDateForInput(response.data.dateCloture),
          });
        }
      },
      error: (error) => console.error(error),
    });
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response) => {
        alert(response.message || 'Intervention créée avec succès');
        this.router.navigate(['/vehicules/details', this.vehiculeId()]);
      },
      error: (error) => console.error(error),
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response) => {
        alert(response.message || 'Intervention mise à jour');
        this.router.navigate(['/vehicules/details', this.vehiculeId()]);
      },
      error: (error) => console.error(error),
    });
  }
}
