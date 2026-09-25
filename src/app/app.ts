import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { VehicleList } from './features/vehicles/vehicle-list/vehicle-list';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';


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
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

}
