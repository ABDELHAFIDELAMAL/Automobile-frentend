import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../../entities/Utilisateur';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../entities/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private baseUrl: string = 'http://localhost:8080/api/v1/utilisateurs';
  private http = inject(HttpClient);

  getAllUtilisateurs(): Observable<ApiResponse<Utilisateur[]>> {
    return this.http.get<ApiResponse<Utilisateur[]>>(`${this.baseUrl}`);
  }

  getUtilisateurById(id: number): Observable<ApiResponse<Utilisateur>> {
    return this.http.get<ApiResponse<Utilisateur>>(`${this.baseUrl}/${id}`);
  }

  createUtilisateur(utilisateur: Utilisateur): Observable<ApiResponse<Utilisateur>> {
    return this.http.post<ApiResponse<Utilisateur>>(`${this.baseUrl}`, utilisateur);
  }

  updateUtilisateur(id: number, utilisateur: Utilisateur): Observable<ApiResponse<Utilisateur>> {
    return this.http.put<ApiResponse<Utilisateur>>(`${this.baseUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  changeStatutUtilisateur(id: number, activer: boolean): Observable<ApiResponse<Utilisateur>> {
    const action = activer ? 'activer' : 'desactiver';
    return this.http.patch<ApiResponse<Utilisateur>>(`${this.baseUrl}/${action}/${id}`, {});
  }
}
