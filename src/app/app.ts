import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { Login } from './features/auth/login/login';


@Component({
  imports: [RouterOutlet, Header, Footer, SidebarComponent, VehiculeList, Login],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Automobile');

  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
