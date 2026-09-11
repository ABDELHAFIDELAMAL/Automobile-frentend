import { Role } from '../enums/Role.enum';

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  enabled: boolean;
  role: Role[];
}
