import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../services/VehiculeService';
import { Vehicule } from '../../../entities/Vehicule';
import { Status } from '../../../enums/Status.enum';

@Component({
  selector: 'app-vehicule-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './vehicule-detail.html',
  styleUrl: './vehicule-detail.css',
})
export class VehiculeDetail implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly Status = Status;

  vehicule = signal<Vehicule | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getVehiculeById(+id);
    } else {
      this.errorMessage.set('Identifiant du véhicule introuvable.');
      this.loading.set(false);
    }
  }

  getVehiculeById(id: number): void {
    this.vehicleService.getVehiculeById(id).subscribe({
      next: (response) => {
        this.vehicule.set(response.data || response);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error lors de getVehiculeById:', err);
        this.errorMessage.set('Impossible de charger les informations du véhicule.');
        this.loading.set(false);
      }
    });
  }

  getInterventionsEnCours() {
    const list = this.vehicule()?.interventions || [];
    return list.filter((i) => i.status !== Status.RESTITUEE && i.status !== Status.TERMINEE);
  }

  getHistoriqueInterventions() {
    const list = this.vehicule()?.interventions || [];
    return list.filter((i) => i.status === Status.RESTITUEE || i.status === Status.TERMINEE);
  }
}
