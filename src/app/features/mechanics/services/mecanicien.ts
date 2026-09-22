import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mecanicien } from '../../../entities/Mechanic';
import { Intervention } from '../../../entities/Interventions';
import { ApiResponce } from '../../../entities/ApiResponce';
import { environment } from '../../../environment/environment';
import { Specialite } from '../../../enums/Specialty.enum';

@Injectable({
  providedIn: 'root',
})
export class MecanicienService {
  private baseUrl = `${environment.baseUrl}/mechanics`;
  private readonly http = inject(HttpClient);

  getAllMechanicals(): Observable<ApiResponce<Mecanicien[]>> {
    return this.http.get<ApiResponce<Mecanicien[]>>(this.baseUrl);
  }

  getMechanicalsDisponibles(disponible: boolean): Observable<ApiResponce<Mecanicien[]>> {
    const params = new HttpParams().set('disponible', disponible.toString());
    return this.http.get<ApiResponce<Mecanicien[]>>(`${this.baseUrl}/disponibles`, { params });
  }

  getMecanicienById(id: number): Observable<ApiResponce<Mecanicien>> {
    return this.http.get<ApiResponce<Mecanicien>>(`${this.baseUrl}/${id}`);
  }

  createMecanicien(mecanicien: Partial<Mecanicien>): Observable<ApiResponce<Mecanicien>> {
    return this.http.post<ApiResponce<Mecanicien>>(`${this.baseUrl}/create`, mecanicien);
  }

  updateMecanicien(
    id: number,
    mecanicien: Partial<Mecanicien>,
  ): Observable<ApiResponce<Mecanicien>> {
    return this.http.put<ApiResponce<Mecanicien>>(`${this.baseUrl}/update/${id}`, mecanicien);
  }

  deleteMecanicien(id: number): Observable<ApiResponce<void>> {
    return this.http.delete<ApiResponce<void>>(`${this.baseUrl}/delete/${id}`);
  }

  activer(id: number): Observable<ApiResponce<Mecanicien>> {
    return this.http.patch<ApiResponce<Mecanicien>>(`${this.baseUrl}/activer/${id}`, null);
  }

  desactiver(id: number): Observable<ApiResponce<Mecanicien>> {
    return this.http.patch<ApiResponce<Mecanicien>>(`${this.baseUrl}/desactiver/${id}`, null);
  }

  getInterventions(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/${id}/interventions`);
  }

  getCharge(): Observable<ApiResponce<Record<number, number>>> {
    return this.http.get<ApiResponce<Record<number, number>>>(`${this.baseUrl}/charge`);
  }

  getMecaniciensBySpecialite(specialite: Specialite): Observable<ApiResponce<Mecanicien[]>> {
    return this.http.get<ApiResponce<Mecanicien[]>>(`${this.baseUrl}/by/specialite`, {
      params: { specialite: specialite.toString() },
    });
  }
}
