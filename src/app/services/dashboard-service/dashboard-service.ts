import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponce } from '../../entities/ApiResponce';
import { Dashboard } from '../../entities/Dashboard';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = `${environment.baseUrl}/dashboard`;
  private readonly http = inject(HttpClient);

  getWorkshopStats(): Observable<ApiResponce<Dashboard>> {
    return this.http.get<ApiResponce<Dashboard>>(`${this.baseUrl}/stats`);
  }
}
