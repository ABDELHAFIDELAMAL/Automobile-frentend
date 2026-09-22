import { Component, OnInit, signal } from '@angular/core';
import { VehicleService } from '../services/VehicleService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../../entities/Vehicle';
import { RouterLink } from '@angular/router';
import { Status } from '../../../enums/Status.enum';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-vehicle-list',
  styleUrl: './vehicle-list.css',
  templateUrl: './vehicle-list.html',
  standalone: true,
})
export class VehicleList implements OnInit {
  vehicles = signal<Vehicle[]>([]);
  searchTerm = '';
  statuses = Object.values(Status);
  selectedStatus: Status | null = null;
  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        console.log('Length:', response.data.length);
        this.vehicles.set(response.data);
        console.log('Vehicles:', this.vehicles());
      },
      error: (err) => {
        console.error('Error loading vehicles list:', err);
      },
    });
  }

  deleteVehicle(id: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (err) => {
        console.error('Error deleting vehicle:', err);
      },
    });
  }

  onStatusChange() {
    if (!this.selectedStatus) {
      this.loadVehicles();
      return;
    }

    this.vehicleService.getVehicleByStatus(this.selectedStatus).subscribe({
      next: (response) => {
        this.vehicles.set(response.data);
      },
      error: (error) => {
        console.error('Error filtering vehicles by status:', error);
      },
    });
  }

  search() {
    this.vehicleService.search(this.searchTerm).subscribe({
      next: (response) => {
        console.log('Search response:', response.data);
        this.vehicles.set(response.data);
      },
      error: (err) => {
        console.error('Error searching vehicles:', err);
      },
    });
  }
}
