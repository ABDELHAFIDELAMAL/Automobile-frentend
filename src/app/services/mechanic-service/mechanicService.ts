import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../entities/Interventions';
import { environment } from '../../environment/environment';
import { Mechanic } from '../../entities/Mechanic';
import { ApiResponce } from '../../entities/ApiResponce';
import { Specialty } from '../../enums/Specialty.enum';

@Injectable({
  providedIn: 'root',
})
export class MechanicService {
  private readonly baseUrl = `${environment.baseUrl}/mechanics`;
  private readonly http = inject(HttpClient);

  getAllMechanics(): Observable<ApiResponce<Mechanic[]>> {
    return this.http.get<ApiResponce<Mechanic[]>>(this.baseUrl);
  }

  getAvailableMechanics(available: boolean): Observable<ApiResponce<Mechanic[]>> {
    const params = new HttpParams().set('available', available.toString());
    return this.http.get<ApiResponce<Mechanic[]>>(`${this.baseUrl}/available`, { params });
  }

  getMechanicById(id: number): Observable<ApiResponce<Mechanic>> {
    return this.http.get<ApiResponce<Mechanic>>(`${this.baseUrl}/${id}`);
  }

  createMechanic(mechanic: Partial<Mechanic>): Observable<ApiResponce<Mechanic>> {
    return this.http.post<ApiResponce<Mechanic>>(`${this.baseUrl}/create`, mechanic);
  }

  updateMechanic(id: number, mechanic: Partial<Mechanic>): Observable<ApiResponce<Mechanic>> {
    return this.http.put<ApiResponce<Mechanic>>(`${this.baseUrl}/update/${id}`, mechanic);
  }

  deleteMechanic(id: number): Observable<ApiResponce<void>> {
    return this.http.delete<ApiResponce<void>>(`${this.baseUrl}/delete/${id}`);
  }

  activate(id: number): Observable<ApiResponce<Mechanic>> {
    return this.http.patch<ApiResponce<Mechanic>>(`${this.baseUrl}/activate/${id}`, null);
  }

  deactivate(id: number): Observable<ApiResponce<Mechanic>> {
    return this.http.patch<ApiResponce<Mechanic>>(`${this.baseUrl}/deactivate/${id}`, null);
  }

  getInterventions(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/${id}/interventions`);
  }

  getWorkload(): Observable<ApiResponce<Record<number, number>>> {
    return this.http.get<ApiResponce<Record<number, number>>>(`${this.baseUrl}/workload`);
  }

  getMechanicsBySpecialty(specialty: Specialty | string): Observable<ApiResponce<Mechanic[]>> {
    const params = new HttpParams().set('specialty', specialty.toString());
    return this.http.get<ApiResponce<Mechanic[]>>(`${this.baseUrl}/by/specialty`, { params });
  }
}
