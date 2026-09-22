import { Component, OnInit, signal, computed } from '@angular/core';
import { User } from '../../../entities/User';
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
  Utilisateurs = signal<User[]>([]);


  constructor(private utilisateurService: UtilisateurService) {}
  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs() {
    this.utilisateurService.getAllUtilisateurs().subscribe({
      next: (response) => {
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


  changeStatusUtilisateur(id : number , active : boolean){
    this.utilisateurService.changeStatutUtilisateur(id, active).subscribe({
      next: (response) => {
        console.log(response.data);
      },
      error: (error) => {
        console.error('Error de L API utilisateur ghnage Status : ', error);
      }
    })
  }


  deleteUtilisateur(id : number){
    if(confirm("Estez-vous sur supprimer ce utilisateur ?")){
      this.utilisateurService.deleteUtilisateur(id).subscribe({
        next: (response) => {
          this.loadUtilisateurs();
        },
        error: (error) => {
          console.log('Erreur lors de supprimer l utlisateur ', error);
        },
      })
    }
  }

  changeStatutUtilisateur(id: number , active : boolean): void {
    this.utilisateurService.changeStatutUtilisateur(id, active).subscribe({
      next: (response) => {
        this.loadUtilisateurs();
      },
      error: (error) => {
        console.log("Erreur lors de change status utlisateur " , error);
      }
    })
  }



}
