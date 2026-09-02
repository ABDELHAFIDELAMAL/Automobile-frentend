import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriqueIntervention } from '../../vehicules/services/vehicule';

export interface Intervention {
  id?: number;
  type: string;
  description: string;
  diagnostic?: string;
  status: string;
  priorite: string;
  coutEstime: number;
  dateDepot: string | Date;
  dateRestitutionPrevue?: string | Date;
  dateCloture?: string | Date;
  historiqueInterventionList?: HistoriqueIntervention[];
}
@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/interventions';
  private readonly http = inject(HttpClient);

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.baseUrl);
  }

  createIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.baseUrl}/create`, intervention);
  }

  updateIntervention(id: number, intervention: Intervention): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.baseUrl}/update/${id}`, intervention);
  }

  assignMecanicien(id: number, mecanicien: any): Observable<Intervention> {
    return this.http.patch<Intervention>(`${this.baseUrl}/assign/${id}`, mecanicien);
  }

  setCoutEstime(id: number, cout: number): Observable<Intervention> {
    const params = new HttpParams().set('cout', cout.toString());
    return this.http.post<Intervention>(`${this.baseUrl}/setcout/${id}`, null, { params });
  }

  addDiagnostic(id: number, diagnostic: string): Observable<Intervention> {
    const params = new HttpParams().set('diagnostic', diagnostic);
    return this.http.post<Intervention>(`${this.baseUrl}/ajouter/diagnostic/${id}`, null, {
      params,
    });
  }

  changerStatus(id: number, statusIntervention: string): Observable<Intervention> {
    return this.http.patch<Intervention>(`${this.baseUrl}/change/status/${id}`, statusIntervention);
  }

  terminer(id: number): Observable<Intervention> {
    return this.http.patch<Intervention>(`${this.baseUrl}/terminer/${id}`, null);
  }

  restituer(id: number): Observable<Intervention> {
    return this.http.patch<Intervention>(`${this.baseUrl}/restituer/${id}`, null);
  }

  getInterventionByMecanicien(id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.baseUrl}/by/mecanicien/${id}`);
  }

  getInterventionByVehicule(id: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.baseUrl}/by/vehicule/${id}`);
  }

  getEnRetard(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.baseUrl}/en/retard`);
  }

  calculerCoutTotal(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/calculer/cout/total/${id}`);
  }

  getInterventionsByType(type: any): Observable<Intervention[]> {
    return this.http.request<Intervention[]>('GET', `${this.baseUrl}/by/type`, {
      body: type,
    });
  }
}
