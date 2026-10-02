import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionService } from '../../../services/intervention-service/intervention';
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
  vehicleId = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    const isUpdateRoute = this.router.url.includes('/update');

    if (!idParam) {
      alert('Erreur : Aucun identifiant spécifié dans l’URL.');
      this.router.navigate(['/vehicles']);
      return;
    }

    const id = Number(idParam);

    if (isUpdateRoute) {
      this.interventionId = id;
      this.loadInterventionDetails(id);
    } else {
      this.vehicleId.set(id);
      const vehicleControl = this.interventionForm.get('vehicleId');
      if (vehicleControl) {
        vehicleControl.setValidators([Validators.required]);
      }
      this.forceControlValue('vehicleId', id);
    }
  }

  private initForm(): void {
    this.interventionForm = new FormGroup({
      vehicleId: new FormControl<number | null>(null),
      mechanicId: new FormControl<number | null>(null),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),
      status: new FormControl('RECEIVED', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      estimatedCost: new FormControl(0, [Validators.required, Validators.min(0)]),
      depositDate: new FormControl('', [Validators.required]),
      estimatedReturnDate: new FormControl('', [Validators.required]),
      closureDate: new FormControl(''),
    });
  }

  private forceControlValue(controlName: string, value: any): void {
    const control = this.interventionForm.get(controlName);
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
      control.setErrors(null);
      control.updateValueAndValidity({ onlySelf: true });
    }
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      console.log('Formulaire invalide:', this.interventionForm.value);
      console.log('Erreurs détaillées:', this.getFormErrors());
      return;
    }

    const formValue = this.interventionForm.getRawValue();
    const currentVehicleId = this.vehicleId() ?? formValue.vehicleId;

    const estimatedCost = Number(formValue.estimatedCost);

    const interventionPayload: any = {
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic?.trim() || null,
      status: formValue.status,
      priority: formValue.priority,
      estimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost,
      depositDate: formValue.depositDate || null,
      estimatedReturnDate: formValue.estimatedReturnDate || null,
      closureDate: formValue.closureDate || null,
      mechanic: null,
    };

    if (currentVehicleId) {
      interventionPayload.vehicle = {
        id: Number(currentVehicleId),
      };
    }

    if (
      formValue.mechanicId !== null &&
      formValue.mechanicId !== undefined &&
      formValue.mechanicId !== '' &&
      formValue.mechanicId !== 'null'
    ) {
      interventionPayload.mechanic = {
        id: Number(formValue.mechanicId),
      };
    }

    if (this.interventionId) {
      this.updateIntervention(this.interventionId, interventionPayload);
    } else {
      if (!currentVehicleId) {
        alert('Erreur : Impossible de créer une intervention sans véhicule.');
        return;
      }
      this.createIntervention(interventionPayload);
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => {
        const data = response?.data ?? response;

        if (!data) {
          console.error('Intervention introuvable.');
          return;
        }

        const currentVehicleId = data.vehicleId ?? null;
        const mechanicId = data.mechanicId ?? null;

        const returnDate = data.estimatedReturnDate ?? data.estimatedReturnDate ?? null;
        const depDate = data.depositDate ?? data.depositDate ?? null;
        const closeDate = data.closureDate ?? data.closureDate ?? null;

        if (currentVehicleId) {
          this.vehicleId.set(Number(currentVehicleId));
        }

        this.interventionForm.patchValue({
          type: data.type ?? '',
          description: data.description ?? '',
          diagnostic: data.diagnostic ?? '',
          status: data.status ?? 'RECEIVED',
          priority: data.priority ?? '',
          estimatedCost: data.estimatedCost ?? 0,
          mechanicId: mechanicId ? Number(mechanicId) : null
        });

        if (currentVehicleId) {
          this.forceControlValue('vehicleId', Number(currentVehicleId));
        } else {
          this.interventionForm.get('vehicleId')?.clearValidators();
        }

        if (depDate) {
          this.forceControlValue('depositDate', this.formatDateTimeForInput(depDate));
        }

        if (returnDate) {
          this.forceControlValue('estimatedReturnDate', this.formatDateTimeForInput(returnDate));
        }

        if (closeDate) {
          this.forceControlValue('closureDate', this.formatDateTimeForInput(closeDate));
        }

        this.interventionForm.updateValueAndValidity();

        console.log('Valeurs appliquées au Formulaire:', this.interventionForm.getRawValue());
        console.log('Statut Formulaire Valid:', this.interventionForm.valid);

        if (!this.interventionForm.valid) {
          console.warn('Erreurs de validation détectées:', this.getFormErrors());
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
      },
    });
  }

  private formatDateTimeForInput(value: string | Date | null | undefined): string {
    if (!value) return '';

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';

      const pad = (num: number) => String(num).padStart(2, '0');

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response: any) => {
        alert(response.message || 'Intervention créée avec succès');
        this.goBackToVehicle();
      },
      error: (error) => {
        console.error('Erreur création intervention:', error);
      },
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response: any) => {
        alert(response.message || 'Intervention mise à jour avec succès');
        this.goBackToVehicle();
      },
      error: (error) => {
        console.error('Erreur modification intervention:', error);
      },
    });
  }

  private getFormErrors(): Record<string, any> {
    const errors: Record<string, any> = {};
    Object.keys(this.interventionForm.controls).forEach((key) => {
      const controlErrors = this.interventionForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  private goBackToVehicle(): void {
    const currentId = this.vehicleId();
    if (currentId) {
      this.router.navigate(['/vehicles/details', currentId]);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }
}
