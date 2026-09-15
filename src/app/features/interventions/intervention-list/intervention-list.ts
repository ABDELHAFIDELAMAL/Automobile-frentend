import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../services/intervention';
import { Status } from '../../../enums/Status.enum';
import { Mecanicien } from '../../../entities/Mecanicien';
import { MecanicienService } from '../../mecaniciens/services/mecanicien';
import { TypeIntervention } from '../../../enums/TypeIntervention.enum';
import { ApiResponse } from '../../../entities/ApiResponse';

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './intervention-list.html',
  styleUrl: './intervention-list.css',
})
export class InterventionList implements OnInit {
  private readonly interventionService = inject(InterventionService);
  private readonly mecanicienService = inject(MecanicienService);

  protected readonly Status = Status;
  statuses: Status[] = Object.values(Status);

  typesInterventions: TypeIntervention[] = Object.values(TypeIntervention);

  interventions = signal<Intervention[]>([]);
  mecaniciens = signal<Mecanicien[]>([]);
  coutTotal = signal<number>(0);

  totalInterventions() {
    return this.interventions().length;
  }

  totalDiagnostics = () => {
    return this.interventions().filter((item) => item.type === 'DIAGNOSTIC').length;
  };

  totalReparations = () => {
    return this.interventions().filter((item) => item.type === 'REPARATION').length;
  };

  coutTotalEstime = () => {
    return this.interventions().reduce((sum, item) => sum + (item.coutEstime || 0), 0);
  };

  totalDatesInvalides = () => {
    return this.interventions().filter(
      (item) => item.dateRestitutionPrevue && item.dateRestitutionPrevue.toString().startsWith('+'),
    ).length;
  };

  ngOnInit(): void {
    this.loadInterventions();
    this.loadMecaniciens();
    this.calculerCoutTotal();
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (error) => {
        console.log('Erreur loard de load interventions : ', error);
      },
    });
  }

  loadMecaniciens(): void {
    this.mecanicienService.getAllMechanicals().subscribe({
      next: (response) => {
        this.mecaniciens.set(response.data || response);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des mécaniciens :', error);
      },
    });
  }

  changerStatus(id: number, statusCible: Status): void {
    const interventionActuelle = this.interventions().find((item) => item.id === id);
    const nomAuteur = interventionActuelle?.mecanicien?.nom || 'SYSTEM';
    const statusStr = statusCible.toString();

    this.interventionService.changerStatus(id, statusStr, nomAuteur).subscribe({
      next: (response: ApiResponse<Intervention>) => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: statusCible } as typeof item) : item,
          ),
        );
        console.log('Status Intervention changer avec success ');
        alert('Status Intervention changer avec success ');
      },
      error: (err) => {
        console.error("Erreur lors de changer Status de l'Intervention " , err);
      },
    });
  }

  terminerIntervention(id: number): void {
    this.interventionService.terminer(id).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.TERMINEE } as typeof item) : item,
          ),
        );
        alert('Le véhicule a été terminee avec succès !');
      },
      error: (err) => {
        console.error("Erreur lors de la clôture de l'intervention :", err);
      },
    });
  }

  restituer(id: number) {
    this.interventionService.restituer(id).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.RESTITUEE } as typeof item) : item,
          ),
        );
        alert('Le véhicule a été restitué avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors du restituer vehicule :', err);
      },
    });
  }

  getInterventionByMecanicien(idMecanicien: number) {
    this.interventionService.getInterventionByMecanicien(idMecanicien).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des interventions du mécanicien :', err);
      },
    });
  }

  getInterventionByVehicule(idVehicule: number) {
    this.interventionService.getInterventionByVehicule(idVehicule).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des interventions du vehicule :', err);
      },
    });
  }

  calculerCoutTotal(): void {
    this.interventionService.calculerCoutTotal().subscribe({
      next: (response) => {
        const rawTotal = response.data !== undefined ? response.data : response;
        if (rawTotal !== null && rawTotal !== undefined) {
          const cleanTotal = Number(rawTotal);
          if (!isNaN(cleanTotal)) {
            this.coutTotal.set(cleanTotal);
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors du calcul du coût Total : ', err);
      },
    });
  }

  getEnRetard() {
    this.interventionService.getEnRetard().subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.log('Erreur lors de la récupération des interventions en retard : ', err);
        this.interventions.set([]);
      },
    });
  }

  assignMecanicien(interventionId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const mecanicienId = Number(selectElement.value);

    const mecanicienSelectionne = this.mecaniciens().find((m) => m.id === mecanicienId);

    if (!mecanicienSelectionne) {
      console.error('Mécanicien introuvable dans la liste');
      return;
    }

    this.interventionService.assignMecanicien(interventionId, mecanicienSelectionne).subscribe({
      next: (response: ApiResponse<Intervention>) => {
        console.log('Mécanicien assigné avec succès !', response.data);
        alert('Mécanicien assigné avec succès !');
      },
      error: (err) => console.error("Erreur lors de l'assignation :", err),
    });
  }

  getMecaniciensDisponibles(): Mecanicien[] {
    return this.mecaniciens().filter((mecanicien) => mecanicien.disponible);
  }

  setCoutEstime(id: number, coutEstime: number): void {
    this.interventionService.setCoutEstime(id, coutEstime).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, coutEstime: coutEstime } as typeof item) : item,
          ),
        );
      },
      error: (err) => {
        console.log('Erreur lors de la mise à jour du coût estimé : ', err);
      },
    });
  }

  addDiagnostic(id: number, diagnostic: string) {
    this.interventionService.addDiagnostic(id, diagnostic).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, diagnostic: diagnostic } as typeof item) : item,
          ),
        );
        alert('Daignostic ajoute avec successs');
      },
      error: (err) => {
        console.log("Erreur lors de l'ajout du diagnostic : ", err);
      },
    });
  }

  searchInterventions(term: string): void {
    if (!term.trim()) {
      this.loadInterventions();
      return;
    }

    this.interventions.update((list) =>
      list.filter(
        (item) =>
          item.type.toString().toLowerCase().includes(term.toLowerCase()) ||
          item.description?.toLowerCase().includes(term.toLowerCase()) ||
          item.vehicule?.immatriculation.toLowerCase().includes(term.toLowerCase()),
      ),
    );
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (!value) {
      this.loadInterventions();
    } else {
      this.getInterventionByType(value as TypeIntervention);
    }
  }

  getInterventionByType(type: TypeIntervention): void {
    this.interventionService.getInterventionsByType(type).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Erreur lors de getInterventionsByType', err);
      },
    });
  }
}
