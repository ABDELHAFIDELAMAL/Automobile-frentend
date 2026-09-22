import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../entities/User';
import { UserService } from '../services/UserService';

@Component({
  imports: [NgClass, RouterLink],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
  standalone: true,
})
export class UserList implements OnInit {
  private readonly userService = inject(UserService);
  users = signal<User[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
      },
      error: (error) => {
        console.error('API Error fetching users:', error);
      },
    });
  }

  enabledCount = computed(() => {
    return this.users().filter((user) => user.enabled).length;
  });

  disabledCount = computed(() => {
    return this.users().filter((user) => !user.enabled).length;
  });

  toggleUserStatus(id: number, active: boolean): void {
    const status$ = active ? this.userService.activate(id) : this.userService.deactivate(id);
    status$.subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('API Error toggling user status:', error);
      },
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    }
  }
}
