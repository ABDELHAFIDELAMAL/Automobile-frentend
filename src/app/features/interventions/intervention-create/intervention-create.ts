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
  vehicleId = signal<number | null>(null);

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.interventionForm = new FormGroup({
      vehicleId: new FormControl(this.vehicleId(), [Validators.required]),
      mechanicId: new FormControl(null),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),
      status: new FormControl('RECUE', [Validators.required]),
      priority: new FormControl('', [Validators.required]),
      estimatedCost: new FormControl(0, [Validators.required, Validators.min(0)]),
      depositDate: new FormControl(today, [Validators.required]),
      estimatedReturnDate: new FormControl('', [Validators.required]),
      closureDate: new FormControl(''),
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
        this.vehicleId.set(parsedId);
        this.interventionForm.get('vehicleId')?.setValue(parsedId);
      }
    } else {
      alert("Erreur : Aucun identifiant specified in l'URL.");
      this.router.navigate(['/vehicles']);
    }
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.value;
    const currentVehicleId = this.vehicleId() || formValue.vehicleId;

    if (!currentVehicleId) {
      alert("Erreur : Aucun véhicule n'est associé à cette intervention.");
      return;
    }

    const parsedCost = formValue.estimatedCost
      ? parseFloat(formValue.estimatedCost.toString())
      : 0.0;

    const interventionPayload: Intervention = {
      vehicleId: Number(currentVehicleId),
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic || undefined,
      status: formValue.status,
      priority: formValue.priority,
      estimatedCost: isNaN(parsedCost) ? 0.0 : parsedCost,
      depositDate: formValue.depositDate ? `${formValue.depositDate}T00:00:00` : undefined,
      estimatedReturnDate: formValue.estimatedReturnDate
        ? `${formValue.estimatedReturnDate}T00:00:00`
        : undefined,
    };

    if (formValue.mechanicId) {
      interventionPayload.mechanicId = Number(formValue.mechanicId);
    }

    if (formValue.closureDate) {
      interventionPayload.closureDate = `${formValue.closureDate}T00:00:00`;
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
          const data = response.data;
          const currentVehId = data.vehicle?.id || data.vehicleId || null;

          if (currentVehId) {
            this.vehicleId.set(Number(currentVehId));
          }

          const formatDateForInput = (dateValue: any): string => {
            if (!dateValue) return '';
            if (typeof dateValue === 'string') return dateValue.split('T')[0];
            if (dateValue instanceof Date) return dateValue.toISOString().split('T')[0];
            return '';
          };

          this.interventionForm.patchValue({
            vehicleId: currentVehId,
            mechanicId: data.mechanicId || data.mechanicId || null,
            type: data.type,
            description: data.description,
            diagnostic: data.diagnostic,
            status: data.status,
            priority: data.priority || data.priority,
            estimatedCost: data.estimatedCost ?? data.estimatedCost,
            depositDate: formatDateForInput(data.depositDate || data.depositDate),
            estimatedReturnDate: formatDateForInput(
              data.estimatedReturnDate || data.estimatedReturnDate,
            ),
            closureDate: formatDateForInput(data.closureDate || data.closureDate),
          });
        }
      },
      error: (error) => console.error('Erreur the chargement :', error),
    });
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response) => {
        alert(response.message || 'Intervention created with succes');
        this.goBackToVehicle();
      },
      error: (error) => console.error(error),
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response) => {
        alert(response.message || 'Intervention updated');
        this.goBackToVehicle();
      },
      error: (error) => console.error(error),
    });
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
