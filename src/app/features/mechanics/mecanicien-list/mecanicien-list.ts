import { Component, OnInit, signal, inject } from '@angular/core';
import { MechanicService } from '../services/mecanicien';
import { Mechanic } from '../../../entities/Mechanic';
import { Specialty } from '../../../enums/Specialty.enum';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mecanicien-list',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './mecanicien-list.html',
  styleUrl: './mecanicien-list.css',
})
export class MechanicList implements OnInit {
  mechanics = signal<Mechanic[]>([]);
  specialities: Specialty[] = Object.values(Specialty);
  chargesData: Record<number, number> = {};

  private readonly mechanicService = inject(MechanicService);

  ngOnInit(): void {
    this.loadMechanics();
    this.getCharges();
  }

  loadMechanics(): void {
    this.mechanicService.getAllMechanics().subscribe({
      next: (response) => {
        this.mechanics.set(response.data);
      },
      error: (error) => {
        console.error('Erreur API lors du chargement des mécaniciens:', error);
      },
    });
  }

  onSpecialiteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value === '') {
      this.loadMechanics();
    } else {
      const selectedSpecialty = value as Specialty;
      this.getMechanicsBySpecialty(selectedSpecialty);
    }
  }

  getMechanicsBySpecialty(specialty: Specialty): void {
    this.mechanicService.getMechanicsBySpecialty(specialty).subscribe({
      next: (response) => {
        this.mechanics.set(response.data);
      },
      error: (error) => {
        console.error('Erreur lors de getMechanicsBySpecialty:', error.message);
      },
    });
  }

  onDisponibiliteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    if (value === '') {
      this.loadMechanics();
    } else {
      const isAvailable = value === 'disponible';
      this.getAvailableMechanics(isAvailable);
    }
  }

  getAvailableMechanics(available: boolean): void {
    this.mechanicService.getAvailableMechanics(available).subscribe({
      next: (response) => {
        this.mechanics.set(response.data);
      },
      error: (error) => {
        console.error('Erreur lors de getAvailableMechanics:', error.message);
      },
    });
  }

  deleteMechanic(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mécanicien ?')) {
      this.mechanicService.deleteMechanic(id).subscribe({
        next: () => {
          this.mechanics.update((currentList) =>
            currentList.filter((mechanic) => mechanic.id !== id),
          );
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du mécanicien :', error.message);
        },
      });
    }
  }

  toggleStatut(mechanic: Mechanic): void {
    const previousState = mechanic.available;
    mechanic.available = !mechanic.available;

    if (mechanic.available) {
      this.mechanicService.activate(mechanic.id).subscribe({
        next: (response) => {},
        error: (error) => {
          console.error("Erreur d'activation, retour à l'ancien état", error);
          mechanic.available = previousState;
        },
      });
    } else {
      this.mechanicService.deactivate(mechanic.id).subscribe({
        next: (response) => {},
        error: (error) => {
          console.error("Erreur de désactivation, retour à l'ancien état", error);
          mechanic.available = previousState;
        },
      });
    }
  }

  getCharges(): void {
    this.mechanicService.getWorkload().subscribe({
      next: (response) => {
        this.chargesData = response.data;
      },
      error: (error) => {
        console.error('Erreur lors de getWorkload:', error);
      },
    });
  }
}
