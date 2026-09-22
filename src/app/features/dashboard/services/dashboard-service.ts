import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../../entities/ApiResponce';
import { DashboardStats } from '../../../entities/Dashboard';
import { environment } from '../../../environment/environment';


@Service()
export class DashboardService {
  private baseUrl = `${environment.baseUrl}/dashboard`;
  private http = inject(HttpClient);

  getAtelierStats(): Observable<ApiResponce<DashboardStats>> {
    return this.http.get<ApiResponce<DashboardStats>>(`${this.baseUrl}/stats`);
  }
}
