import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from '../shared/components/header/header';
import { Footer } from '../shared/components/footer/footer';
import { SidebarComponent } from '../shared/components/sidebar/sidebar';
import { DashboardComponent } from '../features/dashboard/dashboard/dashboard';
import { VehicleList } from '../features/vehicles/vehicle-list/vehicle-list';

@Component({
  imports: [
    RouterOutlet,
    RouterModule,
    Header,
    Footer,
    SidebarComponent,
    DashboardComponent,
    VehicleList,
  ],
  selector: 'app-new-app',
  styleUrl: './new-app.css',
  templateUrl: './new-app.html',
})
export class NewApp {
  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
