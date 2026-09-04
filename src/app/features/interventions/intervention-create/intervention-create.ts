import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-intervention-create',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf], // Obligatoire pour utiliser les formulaires réactifs
  templateUrl: './intervention-create.html',
  styleUrl: './intervention-create.css',
})
export class InterventionCreate implements OnInit {
  InterventionForm!: FormGroup;

  ngOnInit() {
    this.InterventionForm = new FormGroup({
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
      dateCloture: new FormControl('' , [ Validators.required] ),
    });
  }

  createIntervention() {
    if (this.InterventionForm.valid) {
      console.log(this.InterventionForm.value);
    }
  }
}
