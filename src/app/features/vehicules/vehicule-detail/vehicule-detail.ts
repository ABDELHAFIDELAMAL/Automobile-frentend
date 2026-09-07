import { Component } from '@angular/core';
import { VehicleService } from '../services/VehiculeService';

@Component({
  imports: [],
  selector: 'app-vehicule-detail',
  styleUrl: './vehicule-detail.css',
  templateUrl: './vehicule-detail.html',
})
export class VehiculeDetail {

  constructor(private vehicleService: VehicleService) {}
  getVehiculeDetails(id : number) {
    return this.vehicleService.getVehiculeById(id).subscribe(vehicule => {

    })

  }
}
