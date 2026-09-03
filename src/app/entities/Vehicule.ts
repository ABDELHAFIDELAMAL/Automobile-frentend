import { Intervention } from './Interventions';

export interface Vehicule {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  clientFictif: boolean;
  interventions: Intervention[];
}
