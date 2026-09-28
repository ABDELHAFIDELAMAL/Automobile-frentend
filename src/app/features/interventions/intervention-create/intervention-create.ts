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
  styleUrl: './intervention-create.css'
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
      this.interventionForm.get('vehicleId')?.setValue(id);
      this.interventionForm.updateValueAndValidity();
    }
  }

  private initForm(): void {
    this.interventionForm = new FormGroup({
      vehicleId: new FormControl<number | null>(null, [Validators.required]),
      mechanicId: new FormControl<number | null>(null),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),
      status: new FormControl('RECEIVED', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      estimatedCost: new FormControl(0, [Validators.required, Validators.min(0)]),
      depositDate: new FormControl('', [Validators.required]),
      estimatedReturnDate: new FormControl('', [Validators.required]),
      closureDate: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      console.log('Formulaire invalide:', this.interventionForm.value);
      console.log('Erreurs:', this.getFormErrors());
      return;
    }

    const formValue = this.interventionForm.value;
    const currentVehicleId = this.vehicleId() ?? formValue.vehicleId;

    if (!currentVehicleId) {
      alert('Erreur : Aucun véhicule associé à cette intervention.');
      return;
    }

    const estimatedCost = Number(formValue.estimatedCost);

    const interventionPayload: any = {
      vehicle: {
        id: Number(currentVehicleId)
      },
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic?.trim() || null,
      status: formValue.status,
      priority: formValue.priority,
      estimatedCost: isNaN(estimatedCost) ? 0 : estimatedCost,
      depositDate: formValue.depositDate || null,
      estimatedReturnDate: formValue.estimatedReturnDate || null,
      closureDate: formValue.closureDate || null,
      mechanic: null
    };

    if (
      formValue.mechanicId !== null &&
      formValue.mechanicId !== undefined &&
      formValue.mechanicId !== '' &&
      formValue.mechanicId !== 'null'
    ) {
      interventionPayload.mechanic = {
        id: Number(formValue.mechanicId)
      };
    }

    console.log('Intervention payload:', interventionPayload);

    if (this.interventionId) {
      this.updateIntervention(this.interventionId, interventionPayload);
    } else {
      this.createIntervention(interventionPayload);
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => {
        if (!response?.data) {
          console.error('Intervention introuvable.');
          return;
        }

        const data = response.data;

        const currentVehicleId =
          data.vehicle?.id ??
          data.vehicleId ??
          null;

        if (currentVehicleId) {
          this.vehicleId.set(Number(currentVehicleId));
        }

        this.interventionForm.patchValue({
          vehicleId: currentVehicleId ? Number(currentVehicleId) : null,
          mechanicId: data.mechanicId ?? null,
          type: data.type ?? '',
          description: data.description ?? '',
          diagnostic: data.diagnostic ?? '',
          status: data.status ?? 'RECEIVED',
          priority: data.priority ?? '',
          estimatedCost: data.estimatedCost ?? 0,
          depositDate: this.formatDateTimeForInput(data.depositDate),
          estimatedReturnDate: this.formatDateTimeForInput(data.estimatedReturnDate),
          closureDate: this.formatDateTimeForInput(data.closureDate)
        });

        this.interventionForm.updateValueAndValidity();

        console.log('Intervention chargée:', data);
        console.log('Formulaire:', this.interventionForm.value);
        console.log('Formulaire valide:', this.interventionForm.valid);
        console.log('Erreurs:', this.getFormErrors());
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
      }
    });
  }

  private formatDateTimeForInput(
    value: string | Date | null | undefined
  ): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.substring(0, 16);
    }

    if (value instanceof Date) {
      return value.toISOString().substring(0, 16);
    }

    return '';
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response) => {
        console.log('Intervention créée:', response);
        alert(response.message || 'Intervention créée avec succès');
        this.goBackToVehicle();
      },
      error: (error) => {
        console.error('Erreur création intervention:', error);
        console.error('Erreur backend:', error.error);
      }
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response) => {
        console.log('Intervention mise à jour:', response);
        alert(response.message || 'Intervention mise à jour avec succès');
        this.goBackToVehicle();
      },
      error: (error) => {
        console.error('Erreur modification intervention:', error);
        console.error('Erreur backend:', error.error);
      }
    });
  }

  private getFormErrors(): any {
    return {
      vehicleId: this.interventionForm.get('vehicleId')?.errors,
      type: this.interventionForm.get('type')?.errors,
      description: this.interventionForm.get('description')?.errors,
      status: this.interventionForm.get('status')?.errors,
      priority: this.interventionForm.get('priority')?.errors,
      estimatedCost: this.interventionForm.get('estimatedCost')?.errors,
      depositDate: this.interventionForm.get('depositDate')?.errors,
      estimatedReturnDate: this.interventionForm.get('estimatedReturnDate')?.errors,
      closureDate: this.interventionForm.get('closureDate')?.errors
    };
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
