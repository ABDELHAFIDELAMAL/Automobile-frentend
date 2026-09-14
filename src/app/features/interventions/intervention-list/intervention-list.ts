import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../services/intervention';
import { Status } from '../../../enums/Status.enum';


@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './intervention-list.html',
  styleUrl: './intervention-list.css',
})
export class InterventionList implements OnInit {
  statuses: Status[] = Object.values(Status);

  private readonly interventionService = inject(InterventionService);

  interventions = signal<Intervention[]>([]);

  totalInterventions() {
    return this.interventions().length;
  }

  totalDiagnostics = () => {
    return this.interventions().filter((item) => item.type === 'DIAGNOSTIC').length;
  };

  totalReparations = () => {
    return this.interventions().filter((item) => item.type === 'REPARATION').length;
  };

  coutTotalEstime = () => {
    return this.interventions().reduce((sum, item) => sum + (item.coutEstime || 0), 0);
  };

  totalDatesInvalides = () => {
    return this.interventions().filter(
      (item) => item.dateRestitutionPrevue && item.dateRestitutionPrevue.toString().startsWith('+'),
    ).length;
  };

  ngOnInit(): void {
    this.loadInterventions();
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (response) => {
        this.interventions.set(response.data);
        console.log('Interventions :', this.interventions());
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  changerStatus(id: number, status: Status): void {
    this.interventionService.changerStatus(id, status).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) => (item.id === id ? ({ ...item, status } as typeof item) : item)),
        );
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut :', err);
      },
    });
  }

  terminerIntervention(id: number): void {
    this.interventionService.terminer(id).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.TERMINEE } as typeof item) : item,
          ),
        );
      },
      error: (err) => {
        console.error("Erreur lors de la clôture de l'intervention :", err);
      },
    });
  }


  notification: { message: string; type: 'success' | 'error' } | null = null;

  restituer(id: number) {
    this.interventionService.restituer(id).subscribe({
      next: (response) => {
        this.notification = {
          message: 'Le véhicule a été restitué avec succès !',
          type: 'success',
        };
        this.loadInterventions();
      },
      error: (err) => {
        this.notification = {
          message: err.error?.message || 'Une erreur est survenue lors de la restitution.',
          type: 'error',
        };
      },
    });
  }
}
