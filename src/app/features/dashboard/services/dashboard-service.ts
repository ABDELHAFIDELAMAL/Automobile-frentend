import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../entities/ApiResponse';
import { DashboardStats } from '../../../entities/Dashboard';


@Service()
export class DashboardService {
  private ApiUrl: String = 'http://localhost:8080/api/v1/dashboard';
  private http = inject(HttpClient);

  getAtelierStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.ApiUrl}/stats`);
  }

}
