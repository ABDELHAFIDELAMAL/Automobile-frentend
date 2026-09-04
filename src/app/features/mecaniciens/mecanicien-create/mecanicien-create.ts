import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Specialite } from '../../../enums/Specialite.enum';
import { NgIf } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-mecanicien-create',
  styleUrl: './mecanicien-create.css',
  templateUrl: './mecanicien-create.html',
})
export class MecanicienCreate {
  Specialite = Specialite;

  MecanicienForm = new FormGroup({
    nom: new FormControl('', [
      Validators.required ,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    specialite: new FormControl('', [Validators.required]),
    disponible: new FormControl(true),
  });

  createMecanicien() {
    console.log(this.MecanicienForm.value);
  }
}
