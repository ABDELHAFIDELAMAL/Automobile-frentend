import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../../../entities/Interventions';
import { ApiResponce } from '../../../entities/ApiResponce';
import { environment } from '../../../environment/environment';
import { Mecanicien } from '../../../entities/Mechanic';
import { TypeIntervention } from '../../../enums/InterventionType.enum';
import { Priorite } from '../../../enums/Priority.enum';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private baseUrl = `${environment.baseUrl}/interventions`;
  private readonly http = inject(HttpClient);

  getAllInterventions(): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(this.baseUrl);
  }

  getInterventionById(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.get<ApiResponce<Intervention>>(`${this.baseUrl}/${id}`);
  }

  createIntervention(intervention: Intervention): Observable<ApiResponce<Intervention>> {
    return this.http.post<ApiResponce<Intervention>>(`${this.baseUrl}/create`, intervention);
  }

  updateIntervention(
    id: number,
    intervention: Partial<Intervention>,
  ): Observable<ApiResponce<Intervention>> {
    return this.http.put<ApiResponce<Intervention>>(`${this.baseUrl}/update/${id}`, intervention);
  }

  assignMecanicien(id: number, mecanicien: Mecanicien): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/assign/${id}`, mecanicien);
  }

  setCoutEstime(id: number, cout: number): Observable<ApiResponce<Intervention>> {
    const params = new HttpParams().set('coutEstime', cout.toString());
    return this.http.post<ApiResponce<Intervention>>(`${this.baseUrl}/setcout/${id}`, null, {
      params,
    });
  }

  addDiagnostic(id: number, diagnostic: string): Observable<ApiResponce<Intervention>> {
    const params = new HttpParams().set('diagnostic', diagnostic);
    return this.http.post<ApiResponce<Intervention>>(
      `${this.baseUrl}/ajouter/diagnostic/${id}`,
      null,
      {
        params,
      },
    );
  }

  changerStatus(id: number, statusIntervention: string, auteur: string,
  ): Observable<ApiResponce<Intervention>> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     const params = new HttpParams().set('auteur', auteur);
    return this.http.patch<ApiResponce<Intervention>>(
      `${this.baseUrl}/change/status/${id}`,
      JSON.stringify(statusIntervention),
      { headers, params },
    );
  }

  terminer(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/terminer/${id}`, null);
  }

  restituer(id: number): Observable<ApiResponce<Intervention>> {
    return this.http.patch<ApiResponce<Intervention>>(`${this.baseUrl}/restituer/${id}`, null);
  }

  getInterventionByMecanicien(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/mecanicien/${id}`);
  }

  getInterventionByVehicule(id: number): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/vehicule/${id}`);
  }

  getEnRetard(): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/en/retard`);
  }

  calculerCoutTotal(): Observable<ApiResponce<number>> {
    return this.http.get<ApiResponce<number>>(`${this.baseUrl}/calculer/cout/total`);
  }

  getInterventionsByType(type: TypeIntervention): Observable<ApiResponce<Intervention[]>> {
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/type`, {
      params: {
        type: type,
      },
    });
  }


  getInterventionsByPriorite(priorite : Priorite) : Observable<ApiResponce<Intervention[]>>{
    return this.http.get<ApiResponce<Intervention[]>>(`${this.baseUrl}/by/priorite` , {
      params: {
        priorite : priorite,
      }
    })
  }
}
