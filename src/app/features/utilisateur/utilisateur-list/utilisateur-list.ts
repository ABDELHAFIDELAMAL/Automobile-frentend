import { Component, OnInit, signal, computed } from '@angular/core';
import { Utilisateur } from '../../../entities/Utilisateur';
import { UtilisateurService } from '../services/utilisateur';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [NgClass, RouterLink],
  selector: 'app-utilisateur-list',
  styleUrl: './utilisateur-list.css',
  templateUrl: './utilisateur-list.html',
  standalone: true,
})
export class UtilisateurList implements OnInit {
  Utilisateurs = signal<Utilisateur[]>([]);


  constructor(private utilisateurService: UtilisateurService) {}
  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.utilisateurService.getAllUtilisateurs().subscribe({
      next: (response) => {
        console.log(response);
        console.log(response.data);
        this.Utilisateurs.set(response.data);
        console.log('Utilsateurs ', this.Utilisateurs());
      },
      error: (error) => {
        console.error('Error de L API utilisateurs', error);
      },
    });
  }

  counterEnabled = computed(() => {
    return this.Utilisateurs().filter((user) => user.enabled).length;
  });

  coutNonEnabled = computed(() => {
    return this.Utilisateurs().filter((user) => !user.enabled).length;
  });
}
