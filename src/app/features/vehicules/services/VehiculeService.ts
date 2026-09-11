import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Vehicule } from '../../../entities/Vehicule';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiResponse } from '../../../entities/ApiResponse';


@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = `${environment.baseUrl}/vehicules`;
  private http = inject(HttpClient);

  getAllVehicles(): Observable<ApiResponse<Vehicule[]>> {
    return this.http.get<ApiResponse<Vehicule[]>>(this.baseUrl);
  }

  getVehiculeById(id: number): Observable<ApiResponse<Vehicule>> {
    return this.http.get<ApiResponse<Vehicule>>(`${this.baseUrl}/${id}`);
  }

  createVehicule(vehicule: Vehicule): Observable<ApiResponse<Vehicule>> {
    return this.http.post<ApiResponse<Vehicule>>(`${this.baseUrl}/create`, vehicule);
  }

  updateVehicule(id: number, vehicule: Vehicule): Observable<ApiResponse<Vehicule>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<ApiResponse<Vehicule>>(`${this.baseUrl}/vehicles/${id}`, vehicule, {
      headers,
    });
  }

  deleteVehicule(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/delete/${id}`);
  }

  getVehiculeByMatricule(matricule: string): Observable<ApiResponse<Vehicule>> {
    const params = new HttpParams().set('matricule', matricule);
    return this.http.get<ApiResponse<Vehicule>>(`${this.baseUrl}/by/matricule`, { params });
  }

  restituerVehicule(
    id: number,
    username: string,
    userRole: string,
  ): Observable<ApiResponse<Vehicule>> {
    const params = new HttpParams().set('username', username).set('userRole', userRole);
    return this.http.patch<ApiResponse<Vehicule>>(`${this.baseUrl}/restituer/${id}`, null, {
      params,
    });
  }

  affecterMecanicien(idVehicle: number, idMechanic: number): Observable<ApiResponse<Vehicule>> {
    return this.http.patch<ApiResponse<Vehicule>>(
      `${this.baseUrl}/${idVehicle}/affecter/mecanicien/${idMechanic}`,
      null,
    );
  }

  getVehicleByStatus(status: string): Observable<ApiResponse<Vehicule[]>> {
    const params = new HttpParams().set('status', status);
    return this.http.get<ApiResponse<Vehicule[]>>(`${this.baseUrl}/by/status`, { params });
  }

  recherche(text: string): Observable<ApiResponse<Vehicule[]>> {
    const params = new HttpParams().set('text', text);
    return this.http.get<ApiResponse<Vehicule[]>>(`${this.baseUrl}/recherche`, { params });
  }
}
