import { Injectable, inject } from '@angular/core'; // <-- Zid 'inject' hna
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../interventions/services/intervention';

export interface Vehicule {
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  clientFictif: boolean;
  interventions?: Intervention[];
}


export interface HistoriqueIntervention {
  id?: number;
  ancienStatus: string;
  nouveauStatus: string;
  commentaire?: string;
  date: string | Date;
  auteur: string;
}



@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private baseUrl = 'http://localhost:8080/api/v1/vehicules';
  private http = inject(HttpClient);

  getAllVehicles(): Observable<Vehicule[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getVehiculeById(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.baseUrl}/${id}`);
  }

  createVehicule(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.baseUrl}/create`, vehicule);
  }

  updateVehicule(id: number, vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.baseUrl}/update`, vehicule);
  }


  deleteVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getVehiculeByMatricule(matricule: string): Observable<Vehicule> {
    const params = new HttpParams().set('matricule', matricule);
    return this.http.get<Vehicule>(`${this.baseUrl}/by/matricule`, { params });
  }

  restituerVehicule(id: number, username: string, userRole: string): Observable<Vehicule> {
    const params = new HttpParams()
      .set('username', username)
      .set('userRole', userRole);
    return this.http.patch<Vehicule>(`${this.baseUrl}/restituer/${id}`, null, { params });
  }


  affecterMecanicien(idVehicle: number, idMechanic: number): Observable<Vehicule> {
    return this.http.patch<Vehicule>(`${this.baseUrl}/${idVehicle}/affecter/mecanicien/${idMechanic}`, null);
  }

  getVehicleByStatus(status: string): Observable<Vehicule[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Vehicule[]>(`${this.baseUrl}/by/status`, { params });
  }


  recherche(text: string): Observable<Vehicule[]> {
    const params = new HttpParams().set('text', text);
    return this.http.get<Vehicule[]>(`${this.baseUrl}/recherche`, { params });
  }



}
