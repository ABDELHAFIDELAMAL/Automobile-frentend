import { Component, inject, OnInit } from '@angular/core';
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

  private initForm(): void {
    this.interventionForm = new FormGroup({
      vehicule: new FormControl(null, [Validators.required]),
      mecanicien: new FormControl(null),
      historique: new FormControl([]),
      type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      diagnostic: new FormControl(''),
      status: new FormControl('', [Validators.required]),
      priorite: new FormControl('', [Validators.required]),
      coutEstime: new FormControl(0, [Validators.required, Validators.min(0)]),
      dateDepot: new FormControl('', [Validators.required]),
      dateRestitutionPrevue: new FormControl('', [Validators.required]),
      dateCloture: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.interventionForm.invalid) {
      this.interventionForm.markAllAsTouched();
      return;
    }

    const formValue = this.interventionForm.value;
    const parsedCoutEstime = formValue.coutEstime ? parseFloat(formValue.coutEstime.toString()) : 0;

    const interventionPayload = {
      vehicule: { id: Number(formValue.vehicule) },
      mecanicien: formValue.mecanicien ? { id: Number(formValue.mecanicien) } : null,
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
      dateCloture: formValue.dateCloture ? `${formValue.dateCloture}T00:00:00` : null,
    };

    if (this.interventionId) {
      this.updateIntervention(this.interventionId, interventionPayload as any);
    } else {
      this.createIntervention(interventionPayload as any);
    }
  }

  private loadInterventionDetails(id: number): void {
    this.interventionsService.getInterventionById(id).subscribe({
      next: (response) => this.interventionForm.patchValue(response.data),
      error: (error) => {
        console.log(error);
      },
    });
  }

  createIntervention(intervention: Intervention): void {
    this.interventionsService.createIntervention(intervention).subscribe({
      next: (response) => {
        console.log('Intervention creer :', intervention);
        alert(response.message);
        this.router.navigate(['/interventions']).then(r => {});
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateIntervention(id: number, intervention: Intervention): void {
    this.interventionsService.updateIntervention(id, intervention).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/interventions']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
