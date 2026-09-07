import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { VehicleService } from '../services/VehiculeService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-vehicule-create',
  styleUrl: './vehicule-create.css',
  templateUrl: './vehicule-create.html',
  standalone: true,
})



export class VehiculeCreate implements OnInit {
  isEditMode = false;
  vehiculeId!: number;

  VehiculeForm = new FormGroup({
    immatriculation: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
    marque: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    modele: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-Z0-9\s\-_.]+$/),
    ]),
    annee: new FormControl<number | string>('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear()),
    ]),
    kilometrage: new FormControl<number | string>('', [
      Validators.required,
      Validators.min(0),
      Validators.max(9999999),
    ]),
    clientFictif: new FormControl(false),
  });

  constructor(
    private vehiculeService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.vehiculeId = Number(idParam);
      this.loadVehicule(this.vehiculeId);
    }
  }

  loadVehicule(id: number): void {
    this.vehiculeService.getVehiculeById(id).subscribe({
      next: (response: any) => {
        const vehicule = response.data || response;
        this.VehiculeForm.patchValue(vehicule);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (this.VehiculeForm.invalid) {
      this.VehiculeForm.markAllAsTouched();
      return;
    }

    const vehicule = this.VehiculeForm.value;

    if (this.isEditMode) {
      this.vehiculeService.updateVehicule(this.vehiculeId, vehicule).subscribe({
        next: () => {
          this.router.navigate(['/vehicules']);
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.vehiculeService.createVehicule(vehicule).subscribe({
        next: () => {
          this.router.navigate(['/vehicules']);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/vehicules']);
  }
}
