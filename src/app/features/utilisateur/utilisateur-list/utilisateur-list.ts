import { Component, OnInit, signal } from '@angular/core';
import { Utilisateur } from '../../../entities/Utilisateur';
import { UtilisateurService } from '../services/utilisateur';

@Component({
  imports: [],
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
      next: response => {
        this.Utilisateurs.set(response.data);
        console.log('Utilsateurs ' , this.Utilisateurs());
      },
      error: error => {
        console.error("Error de L API utilisateurs", error);
      }
    })
  }
}
