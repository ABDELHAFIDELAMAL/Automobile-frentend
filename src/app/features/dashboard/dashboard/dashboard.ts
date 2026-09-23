import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../services/dashboard-service';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { Dashboard } from '../../../entities/Dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, KeyValuePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  stats = signal<Dashboard | null>(null);
  delays = signal<any[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.dashboardService.getWorkshopStats().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.stats.set(response.data);
          this.delays.set(response.data.delayedReturns || []);
          console.log('Stats: ', this.stats());
          console.log('Delays: ', this.delays());
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage.set('Unable to load dashboard data.');
        this.loading.set(false);
      },
    });
  }
}
