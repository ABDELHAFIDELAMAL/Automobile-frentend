import { Component, OnInit } from '@angular/core';
import { Historique } from '../../../entities/Historique';
import { InterventionService } from '../../interventions/services/intervention';
import { HistoriqueService } from '../service/historique-service';
import { DatePipe } from '@angular/common';

@Component({
  imports: [
    DatePipe
  ],
  selector: 'app-intervention-history',
  styleUrl: './intervention-history.css',
  templateUrl: './intervention-history.html',
  standalone: true,
})
export class InterventionHistory implements OnInit {
  historiques: Historique[] = [];

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.loadHistorique();
    this.getHistoriqueByInterventionId(1);
  }

  loadHistorique() {
    this.historiqueService.getAllHistoriques().subscribe({
      next: (response) => {
        this.historiques = response.data;
        console.log('Historiques : ', this.historiques);
      },
    });
  }


  getHistoriqueByInterventionId(interventionId: number): void {
    this.historiqueService.getHistoriqueByInterventionId(interventionId).subscribe({
      next: (response) => {
        this.historiques = response.data;
        console.log(`Historiques de intervention ${interventionId}` , this.historiques);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
