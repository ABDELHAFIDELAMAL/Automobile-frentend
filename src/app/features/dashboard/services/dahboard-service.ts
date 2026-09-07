import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class DahboardService {
  private baseUrl: string = 'http://localhost:8080/api/v1/dashboard/';
  private http: HttpClient = inject(HttpClient);

  getAtelierStats(){
    return this.http.get<any>(`${this.baseUrl}/status`)
  };
}
