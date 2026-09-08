import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../services/intervention';

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './intervention-list.html',
  styleUrl: './intervention-list.css',
})
export class InterventionList implements OnInit {
  private readonly interventionService
    = inject(InterventionService);

  interventions: Intervention[] = [];

  ngOnInit(): void {
    this.loadInterventions();
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (response) => {

        this.interventions = response.data;
        console.log('Interventions :', this.interventions);

      },
      error: (err) => {
        console.error('Erreur lors du chargement des interventions :', err);
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

}
