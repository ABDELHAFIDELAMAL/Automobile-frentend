import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { VehicleService } from '../services/VehicleService';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../../../entities/Vehicle';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-vehicle-create',
  styleUrl: './vehicle-create.css',
  templateUrl: './vehicle-create.html',
  standalone: true,
})
export class VehicleCreate implements OnInit {
  isEditMode = false;
  vehicleId!: number;

  vehicleForm = new FormGroup({
    matricule: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),

    make: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),

    modele: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-Z0-9\s\-_.]+$/),
    ]),

    year: new FormControl<number | string>('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear()),
    ]),

    mileage: new FormControl<number | string>('', [
      Validators.required,
      Validators.min(0),
      Validators.max(9999999),
    ]),

    dummyClient: new FormControl(false),
  });

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.vehicleId = Number(idParam);
      this.loadVehicle(this.vehicleId);
    }
  }

  loadVehicle(id: number): void {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicleForm.patchValue(response.data);
      },

      error: (error) => {
        console.error('Error loading vehicle:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehicleForm.value;

    const parsedYear = formValue.year ? parseInt(formValue.year.toString(), 10) : null;

    const parsedMileage = formValue.mileage ? parseInt(formValue.mileage.toString(), 10) : 0;

    const vehiclePayload: Vehicle = {
      matricule: formValue.matricule ?? '',
      make: formValue.make ?? '',
      modele: formValue.modele ?? '',
      year: isNaN(parsedYear!) ? null : parsedYear,
      mileage: isNaN(parsedMileage) ? 0 : parsedMileage,
      dummyClient: !!formValue.dummyClient,
    } as unknown as Vehicle;

    if (this.isEditMode) {
      this.updateVehicle(this.vehicleId, vehiclePayload);
    } else {
      this.createVehicle(vehiclePayload);
    }
  }

  createVehicle(vehicle: Vehicle): void {
    this.vehicleService.createVehicle(vehicle).subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          alert('This matricule already exists.');
        } else {
          console.error('Error creating vehicle:', error);
        }
      },
    });
  }

  updateVehicle(id: number, vehicle: Vehicle): void {
    this.vehicleService.updateVehicle(id, vehicle).subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },

      error: (error) => {
        console.error('Error updating vehicle:', error);
      },
    });
  }
}
