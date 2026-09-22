import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../../enums/Role.enum';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../features/users/services/UserService';

@Component({
  imports: [CommonModule],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
  standalone: true,
})
export class Profile implements OnInit {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly route = inject(ActivatedRoute);

  nom: string = '';
  prenom: string = '';
  email: string = '';
  roles: Role[] = [];
  enabled: boolean = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.utilisateurService.getUtilisateurById(+idParam).subscribe({
        next: (response: any) => {
          console.log("Réponse brute de l'API :", response.data);

          const user = response.data;

          this.nom = user.nom || '';
          this.prenom = user.prenom || '';
          this.email = user.email || '';

          if (user.role) {
            this.roles = Array.isArray(user.role) ? user.role : [user.role];
          } else if (user.roles) {
            this.roles = Array.isArray(user.roles) ? user.roles : [user.roles];
          }

          this.enabled = !!user.enabled;
        },
        error: (error) => console.error('Erreur API :', error)
      });
    }
  }
}
