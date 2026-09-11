import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../entities/ApiResponse';
import { Historique } from '../../../entities/Historique';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoriqueService {
  private baseUrl = `${environment.baseUrl}/historiques`;
  private readonly http = inject(HttpClient);

  getAllHistoriques(): Observable<ApiResponse<Historique[]>> {
    return this.http.get<ApiResponse<Historique[]>>(this.baseUrl);
  }

  getHistoriqueByInterventionId(interventionId: number): Observable<ApiResponse<Historique[]>> {
    return this.http.get<ApiResponse<Historique[]>>(
      `${this.baseUrl}/by/intervention/${interventionId}`,
    );
  }

  createHistorique(historique: Partial<Historique>): Observable<ApiResponse<Historique>> {
    return this.http.post<ApiResponse<Historique>>(`${this.baseUrl}/create`, historique);
  }
}
