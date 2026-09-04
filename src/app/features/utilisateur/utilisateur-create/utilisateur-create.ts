import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgIf],
  selector: 'app-utilisateur-create',
  styleUrl: './utilisateur-create.css',
  templateUrl: './utilisateur-create.html',
})
export class UtilisateurCreate implements OnInit {
  UtilisateurForm!: FormGroup;
  ngOnInit(): void {
    this.UtilisateurForm = new FormGroup({
      nom: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      prenom: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      role: new FormControl('', [Validators.required]),
      enabled: new FormControl(true),
    });
  }

  createUtilisateur() {
    console.log(this.UtilisateurForm.value);
  }
}
