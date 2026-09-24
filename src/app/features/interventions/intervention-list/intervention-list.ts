import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Intervention } from '../../../entities/Interventions';
import { InterventionService } from '../../../services/intervention-service/intervention';
import { Status } from '../../../enums/Status.enum';
import { Mechanic } from '../../../entities/Mechanic';
import { MechanicService } from '../../../services/mechanic-service/mechanicService';
import { InterventionType } from '../../../enums/InterventionType.enum';
import { Priority } from '../../../enums/Priority.enum';
import { KeycloakService } from '../../../services/keycloak-service/keycloak-service';

@Component({
  selector: 'app-intervention-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './intervention-list.html',
  styleUrl: './intervention-list.css',
})
export class InterventionList implements OnInit {
  private readonly interventionService = inject(InterventionService);
  private readonly mechanicService = inject(MechanicService);

  protected readonly Status = Status;
  statuses: Status[] = Object.values(Status);

  interventionTypes: InterventionType[] = Object.values(InterventionType);

  interventions = signal<Intervention[]>([]);
  mechanics = signal<Mechanic[]>([]);
  totalCost = signal<number>(0);

  private keycloakService = inject(KeycloakService);

  notification = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  totalInterventions() {
    return this.interventions().length;
  }

  totalDiagnostics = () => {
    return this.interventions().filter((item) => item.type === InterventionType.DIAGNOSTIC).length;
  };

  totalRepairs = () => {
    return this.interventions().filter((item) => item.type === InterventionType.REPAIR).length;
  };

  estimatedTotalCost = () => {
    return this.interventions().reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  };

  invalidDateCount = () => {
    return this.interventions().filter(
      (item) => item.estimatedReturnDate && item.estimatedReturnDate.toString().startsWith('+'),
    ).length;
  };

  ngOnInit(): void {
    this.loadInterventions();
    this.loadMechanics();
    this.calculateTotalCost();
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (error) => {
        console.error('Error loading interventions: ', error);
      },
    });
  }

  loadMechanics(): void {
    this.mechanicService.getAllMechanics().subscribe({
      next: (response) => {
        this.mechanics.set(response.data || response);
      },
      error: (error) => {
        console.error('Error loading mechanics:', error);
      },
    });
  }

  changeStatus(id: number, targetStatus: Status): void {
    const currentIntervention = this.interventions().find((item) => item.id === id);
    const authorName = currentIntervention?.mechanicId
      ? `MECHANIC_${currentIntervention.mechanicId}`
      : 'SYSTEM';
    const statusStr = targetStatus.toString();

    this.interventionService.changeStatus(id, statusStr, authorName).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: targetStatus } as typeof item) : item,
          ),
        );
        this.notification.set({
          message: `Status successfully updated to "${targetStatus}"!`,
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        console.error(err);
        this.notification.set({
          message: err.error?.message || 'Status transition rejected by workflow rules.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
    });
  }

  completeIntervention(id: number): void {
    this.interventionService.complete(id).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.COMPLETED } as typeof item) : item,
          ),
        );
        this.notification.set({
          message: 'Vehicle intervention completed successfully!',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        console.error('Error closing intervention:', err);
        this.notification.set({
          message: err.error?.message || 'An error occurred while closing the intervention.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
    });
  }

  returnVehicle(id: number): void {
    this.interventionService.returnIntervention(id).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, status: Status.RETURNED } as typeof item) : item,
          ),
        );
        this.notification.set({
          message: 'Vehicle returned successfully!',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        console.error('Error returning vehicle:', err);
        this.notification.set({
          message: err.error?.message || 'An error occurred while returning the vehicle.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
    });
  }

  getInterventionsByMechanic(mechanicId: number): void {
    this.interventionService.getInterventionsByMechanic(mechanicId).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Error fetching mechanic interventions:', err);
      },
    });
  }

  getInterventionsByVehicle(vehicleId: number): void {
    this.interventionService.getInterventionsByVehicle(vehicleId).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Error fetching vehicle interventions:', err);
      },
    });
  }

  calculateTotalCost(): void {
    this.interventionService.calculateTotalCost().subscribe({
      next: (response) => {
        const rawTotal = response.data !== undefined ? response.data : response;
        if (rawTotal !== null && rawTotal !== undefined) {
          const cleanTotal = Number(rawTotal);
          if (!isNaN(cleanTotal)) {
            this.totalCost.set(cleanTotal);
          }
        }
      },
      error: (err) => {
        console.error('Error calculating total cost: ', err);
      },
    });
  }

  getOverdueInterventions(): void {
    this.interventionService.getDelayedInterventions().subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Error fetching overdue interventions: ', err);
        this.interventions.set([]);
      },
    });
  }

  assignMechanic(interventionId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const mechanicId = Number(selectElement.value);

    const selectedMechanic = this.mechanics().find((m) => m.id === mechanicId);

    if (!selectedMechanic) {
      console.error('Mechanic not found in local list');
      this.notification.set({
        message: 'Mechanic not found in local list.',
        type: 'error',
      });
      setTimeout(() => this.notification.set(null), 4000);
      return;
    }

    this.interventionService.assignMechanic(interventionId, selectedMechanic).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === interventionId
              ? ({ ...item, mechanicId: mechanicId, vehicleId: item.vehicleId } as typeof item)
              : item,
          ),
        );
        this.notification.set({
          message: 'Mechanic assigned successfully!',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);

        this.getAvailableMechanics();
      },
      error: (err) => {
        console.error('Error assigning mechanic:', err);
        this.notification.set({
          message: err.error?.message || 'An error occurred while assigning the mechanic.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
    });
  }

  getAvailableMechanics(): Mechanic[] {
    return this.mechanics().filter((m) => m.available);
  }

  setEstimatedCost(id: number, estimatedCost: number): void {
    this.interventionService.setEstimatedCost(id, estimatedCost).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, estimatedCost: estimatedCost } as typeof item) : item,
          ),
        );
        this.calculateTotalCost();
        this.notification.set({
          message: 'Estimated cost updated successfully!',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        console.error('Error updating estimated cost: ', err);
        this.notification.set({
          message: err.error?.message || 'An error occurred while updating the cost.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
    });
  }

  addDiagnostic(id: number, diagnostic: string): void {
    this.interventionService.addDiagnostic(id, diagnostic).subscribe({
      next: () => {
        this.interventions.update((list) =>
          list.map((item) =>
            item.id === id ? ({ ...item, diagnostic: diagnostic } as typeof item) : item,
          ),
        );
        this.notification.set({
          message: 'Diagnostic added successfully!',
          type: 'success',
        });
        setTimeout(() => this.notification.set(null), 4000);
      },
      error: (err) => {
        console.error('Error adding diagnostic: ', err);
        this.notification.set({
          message: err.error?.message || 'An error occurred while adding the diagnostic.',
          type: 'error',
        });
        setTimeout(() => this.notification.set(null), 4000);
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
          item.vehicle?.matricule?.toLowerCase().includes(term.toLowerCase()),
      ),
    );
  }

  onTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (!value) {
      this.loadInterventions();
    } else {
      this.getInterventionsByType(value as InterventionType);
    }
  }

  getInterventionsByType(type: InterventionType): void {
    this.interventionService.getInterventionsByType(type).subscribe({
      next: (response) => {
        this.interventions.set(response.data || response);
      },
      error: (err) => {
        console.error('Error fetching interventions by type:', err);
      },
    });
  }

  onChangePriority(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    if (!value) {
      this.loadInterventions();
    } else {
      this.getInterventionsByPriority(value as Priority);
    }
  }

  getInterventionsByPriority(priority: Priority): void {
    this.interventionService.getInterventionsByPriority(priority).subscribe({
      next: (response) => {
        this.interventions.set(response.data);
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }

  isAdmin() : boolean {
    if(this.keycloakService.isAdmin()) {
      return true;
    }
    return false;
  }

  isUser(){
    this.keycloakService.isUser();
  }
}
