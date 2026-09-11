import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../services/intervention';


@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './intervention-list.html',
  styleUrl: './intervention-list.css',
})
export class InterventionList implements OnInit {
  private readonly interventionService = inject(InterventionService);

  interventions = signal<Intervention[]>([]);

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

  changerStatus(id: number, status: string): void {
    this.interventionService.changerStatus(id, status).subscribe({
      next: () => {
        this.loadInterventions();
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut :', err);
      },
    });
  }

  terminerIntervention(id: number): void {
    this.interventionService.terminer(id).subscribe({
      next: () => {
        this.loadInterventions();
      },
      error: (err) => {
        console.error("Erreur lors de la clôture de l'intervention :", err);
      },
    });
  }

  deleteIntervention(id: number): void {
    this.interventionService.deleteIntervention(id).subscribe({
      next: (responce) => {
        alert(responce.message);
        this.loadInterventions();
      },
      error: (err) => {
        alert(err.message);
      }
    })
  }

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
}
