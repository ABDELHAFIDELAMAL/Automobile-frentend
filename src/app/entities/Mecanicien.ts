import { Specialite } from '../enums/Specialite.enum';
import { Intervention } from './Interventions';

export interface Mecanicien {
  id: number;
  nom: string;
  specalite: Specialite;
  disponible: boolean;
  interventions: Intervention[];
}
