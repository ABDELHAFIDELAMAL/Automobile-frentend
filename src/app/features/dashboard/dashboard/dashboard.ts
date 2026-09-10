import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard-service';
import {  DashboardStats } from '../../../entities/Dashboard';
import { DatePipe, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, KeyValuePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats = signal<DashboardStats | null>(null);
  retards = signal<any[]>([]);
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
        if (response && response.data) {
          this.stats.set(response.data);
          this.retards.set(response.data.retardsRestitution || []);
          console.log('Stats : ', this.stats());
          console.log('Stats : ', this.retards());
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage.set('Impossible de charger les données.');
        this.loading.set(false);
      },
    });
  }
}
