import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';
import { CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicule } from '../../../entities/Vehicule';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DecimalPipe, CurrencyPipe, DatePipe, NgFor, NgIf, FormsModule, RouterLink],
  selector: 'app-vehicule-list',
  styleUrl: './vehicule-list.css',
  templateUrl: './vehicule-list.html',
  standalone: true,
})
export class VehiculeList implements OnInit {
  vehicules: Vehicule[] = [];

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadAllVehicles();
  }

  loadAllVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response: any) => {
        this.vehicules = response.data || response;
      },
      error: (err) => {
        console.error('Erreur de API : ', err);
      },
    });
  }

  deleteVehicule(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      return;
    }
    this.vehicleService.deleteVehicule(id).subscribe({
      next: () => {
        this.vehicules = this.vehicules.filter((v) => v.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du véhicule', err);
      },
    });
  }

  testPushVehicule() {
    const prototypeVehicule: Vehicule = {
      id: Math.floor(Math.random() * 1000),
      immatriculation: 'TEST-123-X',
      marque: 'TestMarque',
      modele: 'TestModele',
      annee: 2026,
      kilometrage: 100,
      clientFictif: false,
      interventions: [],
    };

    this.vehicules.push(prototypeVehicule);
  }


  logVehicules(): void {
    for (const vehicule of this.vehicules) {
      console.log(vehicule.id);
    }
  }
}
