import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  isCollapsed = signal<boolean>(false);

  keycloakService = inject(KeycloakService);

  toggleSidebar(): void {
    this.isCollapsed.update((state) => !state);
  }

  isAdmin(){
    return this.keycloakService.isAdmin();
  }

  isUser(){
    return this.keycloakService.isUser();
  }

}
