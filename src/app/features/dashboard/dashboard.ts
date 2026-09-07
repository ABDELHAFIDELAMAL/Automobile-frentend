import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { DashboardService } from './services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats: any = null;
  recentHistory: any[] = [];
  loading = true;
  errorMessage = '';
  private data: Dashboard | undefined;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getAtelierStats().subscribe({
      next: (response) => {
        this.stats = response.data || response;
        this.recentHistory = this.stats.dernieresInterventions || [
          {
            id: 2,
            ancienStatus: 'DEVIS_A_VALIDER',
            nouveauStatus: 'EN_REPARATION',
            commentaire: 'Passage en réparation après validation du devis par téléphone',
            date: '2026-09-03T17:08:13.969418',
            auteur: 'Youssef BENNANI',
          },
        ];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.errorMessage = 'Impossible de charger les données du tableau de bord.';
        this.loading = false;
      },
    });
  }
}
