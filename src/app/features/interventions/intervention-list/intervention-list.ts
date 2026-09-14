import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../services/intervention';
import { Status } from '../../../enums/Status.enum';
import { TypeIntervention } from '../../../enums/TypeIntervention.enum';
import { Mecanicien } from '../../../entities/Mecanicien';
import { MecanicienService } from '../../mecaniciens/services/mecanicien';

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
  protected readonly TypeIntervention = TypeIntervention;
  types: TypeIntervention[] = Object.values(TypeIntervention);

  interventions = signal<Intervention[]>([]);
  mecaniciens = signal<Mecanicien[]>([]);

  coutTotal = signal<number>(0);
  notification = signal<{ message: string; type: 'success' | 'error' } | null>(null);

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
    this.calculerCoutTotal();
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  changerStatus(id: number, status: Status): void {
    this.interventionService.changerStatus(id, status).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) => (item.id === id ? ({ ...item, status } as typeof item) : item)),
        );
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut :', err);
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
      },
      error: (err) => {
        console.error("Erreur lors de la clôture de l'intervention :", err);
      },
    });
  }

  restituer(id: number) {
    this.interventionService.restituer(id).subscribe({
      next: () => {
        this.notification.set({
          message: 'Le véhicule a été restitué avec succès !',
          type: 'success',
        });
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.RESTITUEE } as typeof item) : item,
          ),
        );
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        this.notification.set({
          message: err.error?.message || 'Une erreur est survenue lors de la restitution.',
          type: 'error',
        });
      },
    });
  }

  getInterventionByMecanicien(idMecanicien: number) {
    this.interventionService.getInterventionByMecanicien(idMecanicien).subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des interventions du mécanicien :', err);
      },
    });
  }

  getInterventionByVehicule(idVehicule: number) {
    this.interventionService.getInterventionByVehicule(idVehicule).subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des interventions du vehicule :', err);
      },
    });
  }

  calculerCoutTotal() {
    this.interventionService.calculerCoutTotal().subscribe({
      next: (response) => {
        const total = response.data !== undefined ? response.data : response;
        if (typeof total === 'number') {
          this.coutTotal.set(total);
        }
      },
      error: (err) => {
        console.error('Erreur lors du calcul du coût Total : ', err);
      },
    });
  }

  getInterventionsByType(type: TypeIntervention) {
    this.interventionService.getInterventionsByType(type).subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (err) => {
        console.log('Erreur lors de la récupération des interventions de type : ', err);
      },
    });
  }

  getEnRetard() {
    this.interventionService.getEnRetard().subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (err) => {
        console.log('Erreur lors de la récupération des interventions en retard : ', err);
        this.interventions.set([]);
      },
    });
  }

  assignMecanicien(id: number, mecanicienId: string | number): void {
    const targetId = Number(mecanicienId);

    const mecanicienTrouve = this.mecaniciens().find((mec) => mec.id === targetId);

    if (!mecanicienTrouve) {
      console.error("Mécanicien introuvable avec l'ID :", targetId);
      return;
    }

    this.interventionService.assignMecanicien(id, mecanicienTrouve).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, mecanicien: mecanicienTrouve } as typeof item) : item,
          ),
        );
        this.notification.set({
          message: 'Mécanicien affecté avec succès !',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 3000);
      },
      error: (err) => {
        console.error("Erreur lors de l'affectation du mécanicien :", err);
      },
    });
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
          item.type.toLowerCase().includes(term.toLowerCase()) ||
          item.description?.toLowerCase().includes(term.toLowerCase()) ||
          item.vehicule?.immatriculation.toLowerCase().includes(term.toLowerCase()) ||
          item.vehicule?.marque.toLowerCase().includes(term.toLowerCase()) ||
          item.vehicule?.modele.toLowerCase().includes(term.toLowerCase()),
      ),
    );
  }

  loadMecaniciens() {
    this.mecanicienService.getAllMechanicals().subscribe({
      next: (response) => {
        this.mecaniciens.set(response.data);
      },
      error: (err) => {
        console.error('Erreur lors de get mecaniciens ', err);
      },
    });
  }
}
