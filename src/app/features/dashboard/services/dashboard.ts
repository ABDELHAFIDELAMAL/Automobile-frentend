import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  reçuesAujourdhui: number;
  enDiagnostic: number;
  enRéparation: number;
  terminées: number;
  chargeParMécanicien: Record<number, number>;
  retardsRestitution: any[];
}

@Service()
export class DashboardService {
  private ApiUrl: String = 'http://localhost:8080/api/v1/dashboard';
  private http = inject(HttpClient);

  getAtelierStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.ApiUrl}/stats`);
  }
}
