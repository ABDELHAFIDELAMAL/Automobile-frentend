import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Specialty } from '../../../enums/Specialty.enum';
import { MechanicService } from '../services/mecanicien';
import { Mechanic } from '../../../entities/Mechanic';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-mecanicien-create',
  styleUrl: './mecanicien-create.css',
  templateUrl: './mecanicien-create.html',
  standalone: true,
})
export class MecanicienCreate implements OnInit {
  Speciality = Specialty;

  mechanicService = inject(MechanicService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  mechanicId: number | null = null;

  MechanicForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    speciality: new FormControl('', [Validators.required]),
    available: new FormControl(true),
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.mechanicId = +idParam;

      this.mechanicService.getMechanicById(this.mechanicId).subscribe({
        next: (response) => {
          this.MechanicForm.patchValue({
            name: response.data.name,
            speciality: response.data.specialty,
            available: response.data.available,
          });
        },
        error: (error) => console.error('Erreur loading', error),
      });
    }
  }

  onSubmit(): void {
    if (this.MechanicForm.invalid) {
      this.MechanicForm.markAllAsTouched();
      return;
    }

    const formValue = this.MechanicForm.value;

    const mechanicPayload: any = {
      name: formValue.name,
      speciality: formValue.speciality,
      available: formValue.available,
    };

    if (this.mechanicId) {
      this.updateMechanic(this.mechanicId, mechanicPayload);
    } else {
      this.createMechanic(mechanicPayload);
    }
  }

  createMechanic(mechanic: Mechanic): void {
    this.mechanicService.createMechanic(mechanic).subscribe({
      next: (response) => {
        alert('Mechanic created successfully !');
        this.router.navigate(['/mechanics']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateMechanic(id: number, mechanic: Mechanic): void {
    this.mechanicService.updateMechanic(id, mechanic).subscribe({
      next: (response) => {
        alert('Mechanic updated successfully');
        this.router.navigate(['/mechanics']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
