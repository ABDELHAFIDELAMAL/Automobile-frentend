import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../entities/User';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../entities/ApiResponce';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/users`;

  getAllUtilisateurs(): Observable<ApiResponce<User[]>> {
    return this.http.get<ApiResponce<User[]>>(`${this.apiUrl}`);
  }

  getUtilisateurById(id: number): Observable<ApiResponce<User>> {
    return this.http.get<ApiResponce<User>>(`${this.apiUrl}/${id}`);
  }

  createUtilisateur(utilisateur: User): Observable<ApiResponce<User>> {
    return this.http.post<ApiResponce<User>>(`${this.apiUrl}/add`, utilisateur);
  }

  updateUtilisateur(id: number, utilisateur: User): Observable<ApiResponce<User>> {
    return this.http.put<ApiResponce<User>>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: number): Observable<ApiResponce<void>> {
    return this.http.delete<ApiResponce<void>>(`${this.apiUrl}/delete/${id}`);
  }

  changeStatutUtilisateur(id: number, activer: boolean): Observable<ApiResponce<User>> {
    const action = activer ? 'activer' : 'desactiver';
    return this.http.patch<ApiResponce<User>>(`${this.apiUrl}/${action}/${id}`, {});
  }
}
