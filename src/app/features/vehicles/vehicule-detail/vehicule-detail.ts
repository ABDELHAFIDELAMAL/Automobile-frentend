import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../services/VehicleService';
import { Vehicle } from '../../../entities/Vehicle';
import { Status } from '../../../enums/Status.enum';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);

  protected readonly Status = Status;

  vehicle = signal<Vehicle | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.getVehicleById(+id);
    } else {
      this.errorMessage.set('Vehicle ID not found.');
      this.loading.set(false);
    }
  }

  getVehicleById(id: number): void {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error getting vehicle by ID:', err);
        this.errorMessage.set('Unable to load vehicle information.');
        this.loading.set(false);
      },
    });
  }

  getOngoingInterventions() {
    const list = this.vehicle()?.interventions || [];

    return list.filter(
      (intervention) =>
        intervention.status !== Status.RETURNED &&
        intervention.status !== Status.COMPLETED &&
        intervention.status !== Status.CANCELLED,
    );
  }

  getInterventionHistory() {
    const list = this.vehicle()?.interventions || [];

    return list.filter(
      (intervention) =>
        intervention.status === Status.RETURNED ||
        intervention.status === Status.COMPLETED ||
        intervention.status === Status.CANCELLED,
    );
  }
}
