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

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/vehicles']);
      return;
    }

    const id = Number(idParam);

    if (this.router.url.includes('/update')) {
      this.interventionId = id;
      this.loadInterventionDetails(id);
    } else {
      this.vehicleId.set(id);
      this.interventionForm.get('vehicleId')?.setValue(id);
    }
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.getRawValue();
    const currentVehicleId = this.vehicleId() ?? formValue.vehicleId;

    const interventionPayload: any = {
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic?.trim() || null,
      status: formValue.status,
      priority: formValue.priority,
      estimatedCost: Number(formValue.estimatedCost) || 0,
      depositDate: formValue.depositDate || null,
      estimatedReturnDate: formValue.estimatedReturnDate || null,
      closureDate: formValue.closureDate || null,
      mechanic: formValue.mechanicId && formValue.mechanicId !== 'null' ? { id: Number(formValue.mechanicId) } : null,
    };

    if (currentVehicleId) {
      interventionPayload.vehicle = { id: Number(currentVehicleId) };
    }

    if (this.interventionId) {
      this.interventionsService.updateIntervention(this.interventionId, interventionPayload).subscribe({
        next: (res: any) => {
          alert(res.message || 'Intervention mise à jour avec succès');
          this.goBackToVehicle();
        }
      });
    } else {
      this.interventionsService.createIntervention(interventionPayload).subscribe({
        next: (res: any) => {
          alert(res.message || 'Intervention créée avec succès');
          this.goBackToVehicle();
        }
      });
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => {
        const data = response?.data ?? response;
        if (!data) return;

        const currentVehicleId = data.vehicleId ?? null;
        if (currentVehicleId) this.vehicleId.set(Number(currentVehicleId));

        this.interventionForm.patchValue({
          type: data.type ?? '',
          description: data.description ?? '',
          diagnostic: data.diagnostic ?? '',
          status: data.status ?? 'RECEIVED',
          priority: data.priority ?? '',
          estimatedCost: data.estimatedCost ?? 0,
          mechanicId: data.mechanicId ?? data.mechanicId ?? null,
          depositDate: this.formatDateTimeForInput(data.depositDate ?? data.depositDate),
          estimatedReturnDate: this.formatDateTimeForInput(data.estimatedReturnDate ?? data.estimatedReturnDate),
          closureDate: this.formatDateTimeForInput(data.closureDate ?? data.closureDate)
        });

        if (currentVehicleId) {
          this.interventionForm.get('vehicleId')?.setValue(Number(currentVehicleId));
        }
      }
    });
  }

  private formatDateTimeForInput(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private goBackToVehicle(): void {
    const currentId = this.vehicleId();
    this.router.navigate(currentId ? ['/vehicles/details', currentId] : ['/vehicles']);
  }
}
