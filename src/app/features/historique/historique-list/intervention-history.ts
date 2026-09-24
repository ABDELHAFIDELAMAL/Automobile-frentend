import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { InterventionHistoryService } from '../../../services/intervention-history-service/historique-service';
import { InterventionHistory } from '../../../entities/InterventionHistory';

@Component({
  imports: [DatePipe, NgClass],
  selector: 'app-intervention-history',
  styleUrl: './intervention-history.css',
  templateUrl: './intervention-history.html',
  standalone: true,
})
export class InterventionHistories implements OnInit {
  histories = signal<InterventionHistory[]>([]);

  constructor(private historyService: InterventionHistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyService.getAllHistories().subscribe({
      next: (response) => {
        this.histories.set(response.data);
        console.log('Histories: ', this.histories());
      },
    });
  }

  getHistoryByInterventionId(interventionId: number): void {
    this.historyService.getHistoryByInterventionId(interventionId).subscribe({
      next: (response) => {
        this.histories.set(response.data);
        console.log(`Histories for intervention ${interventionId}`, this.histories());
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  searchByDate(dateValue: string): void {
    if (!dateValue) {
      this.resetFilter();
      return;
    }

    const [year, month, day] = dateValue.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    this.historyService.getHistoriesByDate(formattedDate).subscribe({
      next: (response) => {
        console.log('Data received from server for date ', formattedDate, ': ', response.data);
        this.histories.set(response.data);
      },
      error: (err) => {
        console.error('Error during history filtering:', err);
        this.histories.set([]);
      },
    });
  }

  resetFilter(): void {
    this.loadHistory();
  }
}
