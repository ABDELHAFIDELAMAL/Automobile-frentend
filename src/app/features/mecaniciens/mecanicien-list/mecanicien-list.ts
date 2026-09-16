import { Component, OnInit, signal } from '@angular/core';
import { MecanicienService } from '../services/mecanicien';
import { Mecanicien } from '../../../entities/Mecanicien';
import { Specialite } from '../../../enums/Specialite.enum';

@Component({
  imports: [],
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
        console.log(this.Mecaniciens());
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
        console.log('GetMecaniciensBySpecialite', response.data);
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
        console.log('La list des mecaniciens disponible est : ', response.data);
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
          this.Mecaniciens.update(listeActuelle =>
            listeActuelle.filter(mecanicien => mecanicien.id !== id)
          );
          console.log(`Le mécanicien avec l'ID ${id} a été supprimé avec succès.`);
        },
        error: (error) => {
          console.error("Erreur lors de la suppression du mécanicien :", error.message);
        }
      });
    }
  }

}
