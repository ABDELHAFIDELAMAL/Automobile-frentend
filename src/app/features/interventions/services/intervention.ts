import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../../entities/Interventions';
import { ApiResponse } from '../../../entities/ApiResponse';
import { environment } from '../../../environment/environment';
import { Mecanicien } from '../../../entities/Mecanicien';
import { TypeIntervention } from '../../../enums/TypeIntervention.enum';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private baseUrl = `${environment.baseUrl}/interventions`;
  private readonly http = inject(HttpClient);

  getAllInterventions(): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(this.baseUrl);
  }

  getInterventionById(id: number): Observable<ApiResponse<Intervention>> {
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

  assignMecanicien(id: number, mecanicien: Mecanicien): Observable<ApiResponse<Intervention>> {
    return this.http.patch<ApiResponse<Intervention>>(`${this.baseUrl}/assign/${id}`, mecanicien);
  }

  setCoutEstime(id: number, cout: number): Observable<ApiResponse<Intervention>> {
    const params = new HttpParams().set('coutEstime', cout.toString());
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

  changerStatus(id: number, statusIntervention: string, auteur: string,
  ): Observable<ApiResponse<Intervention>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     const params = new HttpParams().set('auteur', auteur);
    return this.http.patch<ApiResponse<Intervention>>(
      `${this.baseUrl}/change/status/${id}`,
      JSON.stringify(statusIntervention),
      { headers, params },
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

  calculerCoutTotal(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.baseUrl}/calculer/cout/total`);
  }

  getInterventionsByType(type: TypeIntervention): Observable<ApiResponse<Intervention[]>> {
    return this.http.get<ApiResponse<Intervention[]>>(`${this.baseUrl}/by/type`, {
      params: {
        type: type,
      },
    });
  }
}
