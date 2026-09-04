import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
