import { Role } from '../enums/Role.enum';

export interface Utilisateur {
  id?: number;
  username: string;
  email: string;
  nom: string;
  prenom: string;
  password?: string;
  role: Role;
  active: boolean;
}
