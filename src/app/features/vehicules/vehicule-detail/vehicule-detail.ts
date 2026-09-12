import { Component, inject, OnInit, signal } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';
import { Vehicule } from '../../../entities/Vehicule';
import { Router } from '@angular/router';
import { Status } from '../../../enums/Status.enum';

@Component({
  imports: [],
  selector: 'app-vehicule-detail',
  styleUrl: './vehicule-detail.css',
  templateUrl: './vehicule-detail.html',
})
export class VehiculeDetail implements OnInit {
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  vehicule = signal<Vehicule | undefined>(undefined);

  ngOnInit(): void {}

  getVehiculeByMatricule(matricule: string): void {
    this.vehicleService.getVehiculeByMatricule(matricule).subscribe({
      next: (response) => {
        this.vehicule.set(response.data);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }


}
