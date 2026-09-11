import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../../entities/Interventions';
import { ApiResponse } from '../../../entities/ApiResponse';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private baseUrl = `${environment.baseUrl}/interventions`;
  private readonly http = inject(HttpClient);

  getAllInterventions(): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(this.baseUrl);
  }

  getInterventionById(id:number):Observable<ApiResponse<Intervention>>{
    return this.http.get<ApiResponse<Intervention>>(`${this.baseUrl}/${id}`);
  }

  createIntervention(intervention: Intervention): Observable<ApiResponse<Intervention>> {
    return this.http.post<ApiResponse<Intervention>>(`${this.baseUrl}/create`, intervention);
  }

  updateIntervention(
    id: number,
    intervention: Partial<Intervention>,
  ): Observable<ApiResponse<Intervention>> {
    return this.http.put<ApiResponse<Intervention>>(`${this.baseUrl}/update/${id}`, intervention);
  }

  deleteIntervention(id : number): Observable<ApiResponse<void>>{
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${id}`);
  }

  assignMecanicien(id: number, mecanicien: any): Observable<ApiResponse<Intervention>> {
    return this.http.patch<ApiResponse<Intervention>>(`${this.baseUrl}/assign/${id}`, mecanicien);
  }

  setCoutEstime(id: number, cout: number): Observable<ApiResponse<Intervention>> {
    const params = new HttpParams().set('cout', cout.toString());
    return this.http.post<ApiResponse<Intervention>>(`${this.baseUrl}/setcout/${id}`, null, {
      params,
    });
  }

  addDiagnostic(id: number, diagnostic: string): Observable<ApiResponse<Intervention>> {
    const params = new HttpParams().set('diagnostic', diagnostic);
    return this.http.post<ApiResponse<Intervention>>(
      `${this.baseUrl}/ajouter/diagnostic/${id}`,
      null,
      {
        params,
      },
    );
  }

  changerStatus(id: number, statusIntervention: string): Observable<ApiResponse<Intervention>> {
    return this.http.patch<ApiResponse<Intervention>>(
      `${this.baseUrl}/change/status/${id}`,
      statusIntervention,
    );
  }

  terminer(id: number): Observable<ApiResponse<Intervention>> {
    return this.http.patch<ApiResponse<Intervention>>(`${this.baseUrl}/terminer/${id}`, null);
  }

  restituer(id: number): Observable<ApiResponse<Intervention>> {
    return this.http.patch<ApiResponse<Intervention>>(`${this.baseUrl}/restituer/${id}`, null);
  }

  getInterventionByMecanicien(id: number): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(`${this.baseUrl}/by/mecanicien/${id}`);
  }

  getInterventionByVehicule(id: number): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(`${this.baseUrl}/by/vehicule/${id}`);
  }

  getEnRetard(): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(`${this.baseUrl}/en/retard`);
  }

  calculerCoutTotal(id: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/calculer/cout/total/${id}`);
  }

  getInterventionsByType(type: any): Observable<ApiResponse<Intervention[]>> {
    return this.http.request<ApiResponse<Intervention[]>>('GET', `${this.baseUrl}/by/type`, {
      body: type,
    });
  }
}
