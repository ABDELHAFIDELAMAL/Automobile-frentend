import { Component, OnInit, signal } from '@angular/core';
import { VehicleService } from '../services/vehicule';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe, CurrencyPipe, DatePipe],
  selector: 'app-vehicule-list',
  styleUrl: './vehicule-list.css',
  templateUrl: './vehicule-list.html',
})
export class VehiculeList implements OnInit {
  vehicles = signal<any[]>([]);

  constructor(private VehicleService: VehicleService) {}

  ngOnInit(): void {
    this.VehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles.set(data);
        console.log(this.vehicles);
      },
      error: (err) => {
        console.error('Erreur jatna m l-API:', err);
        console.log('Erreuuuuuuuuuuuuuuur');
      },
    });
  }
}
