import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../entities/ApiResponce';
import { Historique } from '../../../entities/InterventionHistory';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoriqueService {
  private baseUrl = `${environment.baseUrl}/histories`;
  private readonly http = inject(HttpClient);

  getAllHistoriques(): Observable<ApiResponce<Historique[]>> {
    return this.http.get<ApiResponce<Historique[]>>(this.baseUrl);
  }

  getHistoriqueByInterventionId(interventionId: number): Observable<ApiResponce<Historique[]>> {
    return this.http.get<ApiResponce<Historique[]>>(
      `${this.baseUrl}/by/intervention/${interventionId}`,
    );
  }

  createHistorique(historique: Partial<Historique>): Observable<ApiResponce<Historique>> {
    return this.http.post<ApiResponce<Historique>>(`${this.baseUrl}/create`, historique);
  }


  getHistoriquesByDate(date: string): Observable<ApiResponce<Historique[]>> {
    const params = new HttpParams().set('date', date);
    return this.http.get<ApiResponce<Historique[]>>(`${this.baseUrl}/by/date`, { params });
  }
}
