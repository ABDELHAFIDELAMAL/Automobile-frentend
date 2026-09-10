import { Role } from '../enums/Role.enum';

export interface Utilisateur {
  id?: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  password?: string;
  active: boolean;
  role: Role[];
}
