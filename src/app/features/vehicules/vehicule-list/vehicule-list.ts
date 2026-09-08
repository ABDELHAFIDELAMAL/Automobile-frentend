import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicule } from '../../../entities/Vehicule';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  selector: 'app-vehicule-list',
  styleUrl: './vehicule-list.css',
  templateUrl: './vehicule-list.html',
  standalone: true,
})
export class VehiculeList implements OnInit {
  vehicules: Vehicule[] = [];

  constructor(private vehicleService: VehicleService) {}



  ngOnInit() {
    this.loadVehicules()
  }

  loadVehicules() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        console.log('Length:', response.data.length);
        this.vehicules = response.data;
        console.log('Vehicules : ', this.vehicules);
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

  deleteVehicule(id: number): void {
    console.log('Delete Vehicule called');
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

}
