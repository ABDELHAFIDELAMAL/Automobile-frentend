import { Component, OnInit, signal } from '@angular/core';
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
  stats = signal<any>(null);
  recentHistory = signal<any[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.dashboardService.getAtelierStats().subscribe({
      next: (response) => {
        const dataReceived = response.data || response;
        console.log('Data Received : ' , dataReceived);
        this.stats.set(dataReceived);


        if (dataReceived.recentHistory()) {
          this.recentHistory.set(dataReceived.rentHistory);
        }

        console.log('Données reçues et assignées au Signal :', dataReceived);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.errorMessage.set('Impossible de charger les données du tableau de bord.');
        this.loading.set(false);
      },
    });
  }

}
