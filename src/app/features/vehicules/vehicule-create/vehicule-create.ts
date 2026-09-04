import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { VehicleService } from '../services/VehiculeService';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-vehicule-create',
  styleUrl: './vehicule-create.css',
  templateUrl: './vehicule-create.html',
})
export class VehiculeCreate {
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
      Validators.pattern(/^[a-zA-Z0-9\s\-_.]+$/)
    ]),

    annee: new FormControl('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear()),
    ]),

    kilometrage: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    clientFictif: new FormControl(false),
  });


  constructor(private vehiculeService : VehicleService) {
  }

  createVehicule() {
    this.vehiculeService.createVehicule(this.VehiculeForm.value);
  }

  updateVehicule(vehicule: any) {
    this.VehiculeForm.patchValue({
      immatriculation: vehicule.immatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      kilometrage: vehicule.kilometrage,
      clientFictif: vehicule.clientFictif,
      annee: vehicule.annee ? vehicule.annee.split('T')[0] : ''
    });
  }

}
