import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../entities/ApiResponse';
import { DashboardStats } from '../../../entities/Dashboard';
import { environment } from '../../../environment/environment';


@Service()
export class DashboardService {
  private baseUrl = `${environment.baseUrl}/dashboard`;
  private http = inject(HttpClient);

  getAtelierStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.baseUrl}/stats`);
  }
}
