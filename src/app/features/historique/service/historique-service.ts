import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../entities/ApiResponce';
import { InterventionHistory } from '../../../entities/InterventionHistory';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class InterventionHistoryService {
  private readonly baseUrl = `${environment.baseUrl}/histories`;
  private readonly http = inject(HttpClient);

  getAllHistories(): Observable<ApiResponce<InterventionHistory[]>> {
    return this.http.get<ApiResponce<InterventionHistory[]>>(this.baseUrl);
  }

  getHistoryByInterventionId(
    interventionId: number,
  ): Observable<ApiResponce<InterventionHistory[]>> {
    return this.http.get<ApiResponce<InterventionHistory[]>>(
      `${this.baseUrl}/by/intervention/${interventionId}`,
    );
  }

  createHistory(
    history: Partial<InterventionHistory>,
  ): Observable<ApiResponce<InterventionHistory>> {
    return this.http.post<ApiResponce<InterventionHistory>>(`${this.baseUrl}/create`, history);
  }

  getHistoriesByDate(date: string): Observable<ApiResponce<InterventionHistory[]>> {
    const params = new HttpParams().set('date', date);
    return this.http.get<ApiResponce<InterventionHistory[]>>(`${this.baseUrl}/by/date`, { params });
  }
}
