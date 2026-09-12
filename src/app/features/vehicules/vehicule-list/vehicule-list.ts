import { Component, OnInit, signal } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicule } from '../../../entities/Vehicule';
import { RouterLink } from '@angular/router';
import { Status } from '../../../enums/Status.enum';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-vehicule-list',
  styleUrl: './vehicule-list.css',
  templateUrl: './vehicule-list.html',
  standalone: true,
})
export class VehiculeList implements OnInit {
  vehicules = signal<Vehicule[] >([]);

  rechercheTerm = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicules()
  }

  loadVehicules() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        console.log('Length:', response.data.length);
        this.vehicules.set(response.data);
        console.log('Vehicules : ', this.vehicules());
      },
      error: (err) => {
        console.error('Error lors de load vehicules list :', err);
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
        this.loadVehicules();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du véhicule', err);
      },
    });
  }


  statuses = Object.values(Status);

  selectedStatus: Status | null = null;

  onStatusChange() {
    if (!this.selectedStatus) {
      this.loadVehicules();
      return;
    }

    this.vehicleService.getVehicleByStatus(this.selectedStatus).subscribe({
      next: (response) => {
        this.vehicules.set(response.data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }




  recherche(){
    this.vehicleService.recherche(this.rechercheTerm).subscribe({
      next: (response) => {
        console.log('Recherche response : ', response.data);
        this.vehicules.set(response.data);
      },
      error: (err) => {
        console.error('Error lors recherche:', err);
      },
    });
  }


  affecterMecanicien(idVehicle: number, idMechanic: number){
    this.vehicleService.affecterMecanicien(idVehicle, idMechanic).subscribe({
      next: (response) => {
        alert('Mecanicien affecte');
        console.log('Mecanicien affecte :' , response.data);
        this.loadVehicules();
      },
      error: (err) => {
        console.error('Error lors de l affectation :', err);
      }
    })
  }

}
