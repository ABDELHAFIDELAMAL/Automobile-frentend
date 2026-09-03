import { Injectable, inject } from '@angular/core'; // <-- @Injectable à la place de @Service
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mecanicien } from '../../../entities/Mecanicien';
import { Intervention } from '../../../entities/Interventions';


@Injectable({
  providedIn: 'root',
})
export class MecanicienService {

  private readonly baseUrl = 'http://localhost:8080/api/v1/mecaniciens';
  private readonly http = inject(HttpClient);


  getAllMechanicals(): Observable<Mecanicien[]> {
    return this.http.get<Mecanicien[]>(this.baseUrl);
  }

  getMechanicalsDisponibles(disponible: boolean): Observable<Mecanicien[]> {
    const params = new HttpParams().set('disponible', disponible.toString());
    return this.http.get<Mecanicien[]>(`${this.baseUrl}/disponibles`, { params });
  }


  getMecanicienById(id: number): Observable<Mecanicien> {
    return this.http.get<Mecanicien>(`${this.baseUrl}/${id}`);
  }

  createMecanicien(mecanicien: Mecanicien): Observable<Mecanicien> {
    return this.http.post<Mecanicien>(`${this.baseUrl}/create`, mecanicien);
  }


  updateMecanicien(id: number, mecanicien: Mecanicien): Observable<Mecanicien> {
    return this.http.put<Mecanicien>(`${this.baseUrl}/update/${id}`, mecanicien);
  }


  deleteMecanicien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  activer(id: number): Observable<Mecanicien> {
    return this.http.patch<Mecanicien>(`${this.baseUrl}/activer/${id}`, null);
  }


  desactiver(id: number): Observable<Mecanicien> {
    return this.http.patch<Mecanicien>(`${this.baseUrl}/desactiver/${id}`, null);
  }

  getInterventions(id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.baseUrl}/${id}/interventions`);
  }


  getCharge(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.baseUrl}/charge`);
  }
}
