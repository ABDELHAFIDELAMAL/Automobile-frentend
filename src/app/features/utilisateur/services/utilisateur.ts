import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../../entities/Utilisateur';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../entities/ApiResponse';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/utilisateurs`;

  getAllUtilisateurs(): Observable<ApiResponse<Utilisateur[]>> {
    return this.http.get<ApiResponse<Utilisateur[]>>(`${this.apiUrl}`);
  }

  getUtilisateurById(id: number): Observable<ApiResponse<Utilisateur>> {
    return this.http.get<ApiResponse<Utilisateur>>(`${this.apiUrl}/${id}`);
  }

  createUtilisateur(utilisateur: Utilisateur): Observable<ApiResponse<Utilisateur>> {
    return this.http.post<ApiResponse<Utilisateur>>(`${this.apiUrl}`, utilisateur);
  }

  updateUtilisateur(id: number, utilisateur: Utilisateur): Observable<ApiResponse<Utilisateur>> {
    return this.http.put<ApiResponse<Utilisateur>>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  changeStatutUtilisateur(id: number, activer: boolean): Observable<ApiResponse<Utilisateur>> {
    const action = activer ? 'activer' : 'desactiver';
    return this.http.patch<ApiResponse<Utilisateur>>(`${this.apiUrl}/${action}/${id}`, {});
  }
}
