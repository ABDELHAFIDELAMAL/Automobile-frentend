import { Intervention } from './Interventions';

export interface Vehicle {
  id?: number;
  matricule: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  dummyClient: boolean;
  interventions?: Intervention[];
}

