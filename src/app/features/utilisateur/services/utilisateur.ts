import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../../entities/Utilisateur';

@Service()
export class UtilisateurService {
  private baseUrl: String = 'localhost:8080/api/v1/users';
  private http = inject(HttpClient);

  getAllUtilisateurs() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getUtilisateurById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  changeStatutUtilisateur(id: number, activer: boolean) {
    const action = activer ? 'activer' : 'desactiver';
    return this.http.patch(`${this.baseUrl}/${action}/${id}`, {});
  }
}
