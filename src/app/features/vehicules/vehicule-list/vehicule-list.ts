import { Component, OnInit, signal } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Vehicule } from '../../../entities/Vehicule';

@Component({
  imports: [DecimalPipe, CurrencyPipe, DatePipe],
  selector: 'app-vehicule-list',
  styleUrl: './vehicule-list.css',
  templateUrl: './vehicule-list.html',
})
export class VehiculeList implements OnInit {
  vehicules = signal<any[]>([]);

  vehcle = {
    id: 1,
    immatriculation: 'Maroc-01-A',
    marque: 'BMW',
    modele: 'M-2023',
    annee: 2023,
    kilometrage: 2000,
    clientFictif: true,
    interventions: [
      {
        id: 1,
        type: 'DIAGNOSTIC',
        description: 'vehicle bmw m4 cs',
        diagnostic: 'diagnostic Numero 001',
        status: 'RECUE',
        priorite: 'MOYENNE',
        coutEstime: 1500.0,
        dateDepot: '2026-09-03T11:42:06.642499',
        dateRestitutionPrevue: '2026-09-10T19:08:16.768',
        dateCloture: '2026-09-03T11:42:06.642499',
        historique: [
          {
            id: 1,
            ancienStatus: 'RECUE',
            nouveauStatus: 'DIAGNOSTIC_EN_COURS',
            commentaire: 'Diagnostic at : 2026-09-03T11:42:06.657119',
            date: '2026-09-03T11:42:06.657119',
            auteur: 'Mohsin EL AMAL',
          },
        ],
      },
    ],
  };

  constructor(private vehicleService: VehicleService) {
    this.vehicules.set([this.vehcle]);
  }

  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response: any) => {
        this.vehicules.set(response.data);
      },
      error: (err) => {
        console.error('Erreur de API : ', err);
      },
    });
  }

  updateVehicule(vehicule: Vehicule) {

  }

  deleteVehicule(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehicleService.deleteVehicule(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.vehicules.update((prev) => prev.filter((v) => v.id !== id));
          }
        },
        error: (err) => console.error('Erreur lors de la suppression:', err),
      });
    }
  }
}
