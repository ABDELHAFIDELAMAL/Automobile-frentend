import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../entities/Interventions';
import { ApiResponce } from '../../entities/ApiResponce';
import { environment } from '../../environment/environment';
import { Mechanic } from '../../entities/Mechanic';
import { InterventionType } from '../../enums/InterventionType.enum';
import { Priority } from '../../enums/Priority.enum';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private readonly baseUrl = `${environment.baseUrl}/interventions`;
  private readonly http = inject(HttpClient);

  getAllInterventions(): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(this.baseUrl);
  }

  getInterventionById(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.get<ApiResponce<Intervention>>(`${this.baseUrl}/${id}`);
  }

  createIntervention(intervention: Partial<Intervention>): Observable<ApiResponce<Intervention>> {
    return this.http.post<ApiResponce<Intervention>>(`${this.baseUrl}/create`, intervention);
  }

  updateIntervention(
    id: number,
    intervention: Partial<Intervention>,
  ): Observable<ApiResponce<Intervention>> {
    return this.http.put<ApiResponce<Intervention>>(`${this.baseUrl}/update/${id}`, intervention);
  }

  assignMechanic(id: number, mechanic: Mechanic): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/assign/${id}`, mechanic);
  }

  setEstimatedCost(id: number, cost: number): Observable<ApiResponce<Intervention>> {
    const params = new HttpParams().set('estimatedCost', cost.toString());
    return this.http.post<ApiResponce<Intervention>>(`${this.baseUrl}/set-cost/${id}`, null, {
      params,
    });
  }

  addDiagnostic(id: number, diagnostic: string): Observable<ApiResponce<Intervention>> {
    const params = new HttpParams().set('diagnostic', diagnostic);
    return this.http.post<ApiResponce<Intervention>>(`${this.baseUrl}/add-diagnostic/${id}`, null, {
      params,
    });
  }

  changeStatus(
    id: number,
    statusIntervention: string,
    author: string,
  ): Observable<ApiResponce<Intervention>> {
    const params = new HttpParams().set('author', author);
    return this.http.patch<ApiResponce<Intervention>>(
      `${this.baseUrl}/change-status/${id}`,
      JSON.stringify(statusIntervention),
      {
        headers: { 'Content-Type': 'application/json' },
        params,
      },
    );
  }

  complete(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/complete/${id}`, null);
  }

  returnIntervention(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/return/${id}`, null);
  }

  getInterventionsByMechanic(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/mechanic/${id}`);
  }

  getInterventionsByVehicle(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/vehicle/${id}`);
  }

  getDelayedInterventions(): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/delayed`);
  }

  calculateTotalCost(): Observable<ApiResponce<number>> {
    return this.http.get<ApiResponce<number>>(`${this.baseUrl}/calculate-total-cost`);
  }

  getInterventionsByType(type: InterventionType | string): Observable<ApiResponce<Intervention[]>> {
    const params = new HttpParams().set('type', type.toString());
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/type`, { params });
  }

  getInterventionsByPriority(priority: Priority | string): Observable<ApiResponce<Intervention[]>> {
    const params = new HttpParams().set('priority', priority.toString());
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/priority`, { params });
  }
}
