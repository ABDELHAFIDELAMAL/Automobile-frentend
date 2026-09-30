import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { VehicleList } from './features/vehicles/vehicle-list/vehicle-list';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { SplashScreen } from './shared/components/splash-screen/splash-screen';


@Component({
  imports: [
    RouterOutlet,
    RouterModule,
    Header,
    SplashScreen,
    Footer,
    SidebarComponent,
    DashboardComponent,
    VehicleList,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  showSplash = signal(true);

  ngOnInit() {
    setTimeout(() => {
      this.showSplash.set(false);
    }, 2400);
  }
}
