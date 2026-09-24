import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Vehicle } from '../../entities/Vehicle';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiResponce } from '../../entities/ApiResponce';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = `${environment.baseUrl}/vehicles`;
  private http = inject(HttpClient);

  getAllVehicles(): Observable<ApiResponce<Vehicle[]>> {
    return this.http.get<ApiResponce<Vehicle[]>>(this.baseUrl);
  }

  getVehicleById(id: number): Observable<ApiResponce<Vehicle>> {
    return this.http.get<ApiResponce<Vehicle>>(`${this.baseUrl}/${id}`);
  }

  createVehicle(vehicle: Vehicle): Observable<ApiResponce<Vehicle>> {
    return this.http.post<ApiResponce<Vehicle>>(
      `${this.baseUrl}/create`,
      vehicle
    );
  }

  updateVehicle(id: number, vehicle: Vehicle): Observable<ApiResponce<Vehicle>> {
    return this.http.put<ApiResponce<Vehicle>>(
      `${this.baseUrl}/update/${id}`,
      vehicle
    );
  }

  deleteVehicle(id: number): Observable<ApiResponce<void>> {
    return this.http.delete<ApiResponce<void>>(
      `${this.baseUrl}/delete/${id}`
    );
  }

  getVehicleByMatricule(
    matricule: string
  ): Observable<ApiResponce<Vehicle>> {
    const params = new HttpParams().set('matricule', matricule);

    return this.http.get<ApiResponce<Vehicle>>(
      `${this.baseUrl}/by/matricule`,
      { params }
    );
  }

  returnVehicle(
    id: number,
    username: string,
    userRole: string
  ): Observable<ApiResponce<Vehicle>> {
    const params = new HttpParams()
      .set('username', username)
      .set('userRole', userRole);

    return this.http.patch<ApiResponce<Vehicle>>(
      `${this.baseUrl}/return/${id}`,
      null,
      { params }
    );
  }

  getVehicleByStatus(
    status: string
  ): Observable<ApiResponce<Vehicle[]>> {
    const params = new HttpParams().set('status', status);

    return this.http.get<ApiResponce<Vehicle[]>>(
      `${this.baseUrl}/by/status`,
      { params }
    );
  }

  search(text: string): Observable<ApiResponce<Vehicle[]>> {
    const params = new HttpParams().set('text', text);

    return this.http.get<ApiResponce<Vehicle[]>>(
      `${this.baseUrl}/search`,
      { params }
    );
  }
}
