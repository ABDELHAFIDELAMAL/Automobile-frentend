import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';


@Component({
  imports: [
    RouterOutlet,
    RouterModule,
    Header,
    Footer,
    SidebarComponent,
    Dashboard,
    VehiculeList,
    Login,
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
