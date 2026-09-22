import { Component, OnInit, signal } from '@angular/core';
import { MecanicienService } from '../services/mecanicien';
import { Mecanicien } from '../../../entities/Mechanic';
import { Specialite } from '../../../enums/Specialty.enum';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [NgClass, RouterLink],
  selector: 'app-mecanicien-list',
  styleUrl: './mecanicien-list.css',
  templateUrl: './mecanicien-list.html',
  standalone: true,
})
export class MecanicienList implements OnInit {
  Mecaniciens = signal<Mecanicien[]>([]);

  specialities: Specialite[] = Object.values(Specialite);
  constructor(private MecanocienService: MecanicienService) {}

  ngOnInit(): void {
    this.loadMecaniciens();
  }

  loadMecaniciens() {
    this.MecanocienService.getAllMechanicals().subscribe({
      next: (response) => {
        this.Mecaniciens.set(response.data);
      },
      error: (error) => {
        console.log('Error de L API', error);
      },
    });
  }

  onSpecialiteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const valeur = target.value;

    if (valeur === '') {
      this.loadMecaniciens();
    } else {
      const specialiteSelectionnee = valeur as Specialite;
      this.getMecaniciensBySpecialite(specialiteSelectionnee);
    }
  }

  getMecaniciensBySpecialite(specialite: Specialite) {
    this.MecanocienService.getMecaniciensBySpecialite(specialite).subscribe({
      next: (response) => {
        this.Mecaniciens.set(response.data);
        },
      error: (error) => {
        console.log('Error lors de GetMecaniciensBySpecialite', error.message);
      },
    });
  }

  onDisponibiliteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const valeur = target.value;
    if (valeur === '') {
      this.loadMecaniciens();
    } else {
      const estDisponible = valeur === 'disponible';
      this.getMecaniciensDisponible(estDisponible);
    }
  }

  getMecaniciensDisponible(disponible: boolean) {
    this.MecanocienService.getMechanicalsDisponibles(disponible).subscribe({
      next: (response) => {
        this.Mecaniciens.set(response.data);
       },
      error: (error) => {
        console.log('Erreur lors de get mecaniciens disponible : ', error.message);
      },
    });
  }

  deleteMecanicien(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mécanicien ?')) {
      this.MecanocienService.deleteMecanicien(id).subscribe({
        next: () => {
          this.Mecaniciens.update((listeActuelle) =>
            listeActuelle.filter((mecanicien) => mecanicien.id !== id),
          );
         },
        error: (error) => {
          console.error('Erreur lors de la suppression du mécanicien :', error.message);
        },
      });
    }
  }

  toggleStatut(mecanicien: any): void {
    const ancienEtat = mecanicien.disponible;
    mecanicien.disponible = !mecanicien.disponible;
    if (mecanicien.disponible) {
      this.MecanocienService.activer(mecanicien.id).subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error("Erreur d'activation, retour à l'ancien état", error);
          mecanicien.disponible = ancienEtat;
        },
      });
    } else {
      this.MecanocienService.desactiver(mecanicien.id).subscribe({
        next: (response) => {

        },
        error: (error) => {
          console.error("Erreur de désactivation, retour à l'ancien état", error);
          mecanicien.disponible = ancienEtat;
        },
      });
    }
  }

  chargesData: any = {};

  getCharges(): void {
    this.MecanocienService.getCharge().subscribe({
      next: (response) => {
        this.chargesData = response.data;
      },
      error: (error) => {
        console.error('Erreur lors de getCharge mecaniciens', error);
      },
    });
  }
}
