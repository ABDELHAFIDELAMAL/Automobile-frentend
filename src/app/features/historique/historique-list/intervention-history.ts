import { Component, OnInit, signal } from '@angular/core';
import { Historique } from '../../../entities/Historique';
import { HistoriqueService } from '../service/historique-service';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  imports: [DatePipe, NgClass],
  selector: 'app-intervention-history',
  styleUrl: './intervention-history.css',
  templateUrl: './intervention-history.html',
  standalone: true,
})
export class InterventionHistory implements OnInit {
  historiques = signal<Historique[]>([]);

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.loadHistorique();
  }

  loadHistorique() {
    this.historiqueService.getAllHistoriques().subscribe({
      next: (response) => {
        this.historiques.set(response.data);
        console.log('Historiques : ', this.historiques());
      },
    });
  }

  getHistoriqueByInterventionId(interventionId: number): void {
    this.historiqueService.getHistoriqueByInterventionId(interventionId).subscribe({
      next: (response) => {
        this.historiques.set(response.data);
        console.log(`Historiques de l'intervention ${interventionId}`, this.historiques());
      },
      error: (err) => {
        console.error(err);
      },
    });
  }


  rechercherParDate(dateValue: string): void {
    if (!dateValue) {
      this.reinitialiserFiltre();
      return;
    }

    const [year, month, day] = dateValue.split('-');
    const dateFormatee = `${day}/${month}/${year}`;

    this.historiqueService.getHistoriquesByDate(dateFormatee).subscribe({
      next: (response) => {
        console.log('Données reçues du serveur de la date ' , dateFormatee , ': ', response.data);
        this.historiques.set(response.data);
      },
      error: (err) => {
        console.error('Erreur lors du filtrage Historique :', err);
        this.historiques.set([]);
      }
    });
  }

  reinitialiserFiltre(): void {
    this.loadHistorique();
  }
}
