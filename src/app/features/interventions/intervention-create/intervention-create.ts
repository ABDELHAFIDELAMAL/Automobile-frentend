import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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

  private initForm(): void {
    this.interventionForm = new FormGroup({
      vehicleId: new FormControl(null, [Validators.required]),
      mechanicId: new FormControl(null),

      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),

      status: new FormControl('RECEIVED', [Validators.required]),
      priority: new FormControl('', [Validators.required]),

      estimatedCost: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),

      depositDate: new FormControl('', [Validators.required]),
      estimatedReturnDate: new FormControl('', [Validators.required]),
      closureDate: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    const isUpdateRoute = this.router.url.includes('/update');

    if (!idParam) {
      alert('Erreur : Aucun identifiant spécifié dans l\'URL.');
      this.router.navigate(['/vehicles']);
      return;
    }

    const parsedId = Number(idParam);

    if (isUpdateRoute) {
      this.interventionId = parsedId;
      this.loadInterventionDetails(parsedId);
    } else {
      this.vehicleId.set(parsedId);
      this.interventionForm.patchValue({
        vehicleId: parsedId
      });
    }
  }

  onSubmit(): void {

    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.value;

    const currentVehicleId =
      this.vehicleId() ?? Number(formValue.vehicleId);

    if (!currentVehicleId) {
      alert('Erreur : Aucun véhicule associé à cette intervention.');
      return;
    }

    const estimatedCost = Number(formValue.estimatedCost) || 0;

    const interventionPayload: any = {
      vehicle: {
        id: Number(currentVehicleId)
      },
      type: formValue.type,
      description: formValue.description,
      diagnostic: formValue.diagnostic?.trim() || null,
      status: formValue.status,
      priority: formValue.priority,
      estimatedCost: estimatedCost,
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

    console.log(
      'Intervention payload:',
      JSON.stringify(interventionPayload, null, 2)
    );
    if (this.interventionId) {
      this.updateIntervention(
        this.interventionId,
        interventionPayload
      );
    } else {
      this.createIntervention(interventionPayload);
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => {
        if (!response?.data) {
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
          vehicleId: currentVehicleId,
          mechanicId:
            data.mechanicId ??
            null,
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
      },
      error: (error) => {
        console.error(
          'Erreur lors du chargement:',
          error
        );
      }
    });
  }

  private formatDateTimeForInput(value: string | Date | null | undefined): string {
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

  private createIntervention(intervention: Intervention): void {
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

  private updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
        next: (response) => {
          alert(response.message || 'Intervention mise à jour avec succès');
          this.goBackToVehicle();
        },
        error: (error) => {
          console.error('Erreur modification intervention:', error);
          console.error('Erreur backend:', error.error);
        }
      });
  }

  private goBackToVehicle(): void {
    const currentId = this.vehicleId();
    if (currentId) {
      this.router.navigate([
        '/vehicles/details',
        currentId
      ]);
    } else {
      this.router.navigate(['/vehicles']);
    }
  }
}
