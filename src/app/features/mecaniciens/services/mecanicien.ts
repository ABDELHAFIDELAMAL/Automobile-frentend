import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mecanicien } from '../../../entities/Mecanicien';
import { Intervention } from '../../../entities/Interventions';
import { ApiResponse } from '../../../entities/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class MecanicienService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/mecaniciens';
  private readonly http = inject(HttpClient);

  getAllMechanicals(): Observable<ApiResponse<Mecanicien[]>> {
    return this.http.get<ApiResponse<Mecanicien[]>>(this.baseUrl);
  }

  getMechanicalsDisponibles(disponible: boolean): Observable<ApiResponse<Mecanicien[]>> {
    const params = new HttpParams().set('disponible', disponible.toString());
    return this.http.get<ApiResponse<Mecanicien[]>>(`${this.baseUrl}/disponibles`, { params });
  }

  getMecanicienById(id: number): Observable<ApiResponse<Mecanicien>> {
    return this.http.get<ApiResponse<Mecanicien>>(`${this.baseUrl}/${id}`);
  }

  createMecanicien(mecanicien: Partial<Mecanicien>): Observable<ApiResponse<Mecanicien>> {
    return this.http.post<ApiResponse<Mecanicien>>(`${this.baseUrl}/create`, mecanicien);
  }

  updateMecanicien(
    id: number,
    mecanicien: Partial<Mecanicien>,
  ): Observable<ApiResponse<Mecanicien>> {
    return this.http.put<ApiResponse<Mecanicien>>(`${this.baseUrl}/update/${id}`, mecanicien);
  }

  deleteMecanicien(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${id}`);
  }

  activer(id: number): Observable<ApiResponse<Mecanicien>> {
    return this.http.patch<ApiResponse<Mecanicien>>(`${this.baseUrl}/activer/${id}`, null);
  }

  desactiver(id: number): Observable<ApiResponse<Mecanicien>> {
    return this.http.patch<ApiResponse<Mecanicien>>(`${this.baseUrl}/desactiver/${id}`, null);
  }

  getInterventions(id: number): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(`${this.baseUrl}/${id}/interventions`);
  }

  getCharge(): Observable<ApiResponse<Record<number, number>>> {
    return this.http.get<ApiResponse<Record<number, number>>>(`${this.baseUrl}/charge`);
  }
}
