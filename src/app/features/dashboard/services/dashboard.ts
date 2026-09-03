import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../dashboard';


@Service()
export class DashboardService {
  private ApiUrl: String = 'http://localhost:8080/api/v1/dashboard';
  private http = inject(HttpClient);

  getAtelierStats(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.ApiUrl}/stats`);
  }
}
