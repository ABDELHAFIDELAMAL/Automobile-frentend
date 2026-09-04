import { Routes } from '@angular/router';
import { Dashboard } from "./features/dashboard/dashboard";
import { Login } from "./features/auth/login/login";
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { MecanicienList } from './features/mecaniciens/mecanicien-list/mecanicien-list';
import { InterventionHistory } from './features/interventions/intervention-history/intervention-history';
import { Register} from './features/auth/register/register';
import { Admin } from './features/admin/admin';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MecanicienCreate } from './features/mecaniciens/mecanicien-create/mecanicien-create';
import { VehiculeCreate } from './features/vehicules/vehicule-create/vehicule-create';
import { UtilisateurCreate } from './features/utilisateur/utilisateur-create/utilisateur-create';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'login', component: Login },
  { path: 'create/vehicule', component: VehiculeCreate },
  { path: 'create/mecanicien', component: MecanicienCreate },
  { path: 'create/intervention', component: InterventionCreate },
  { path: 'create/utilisatuer' , component : UtilisateurCreate },
  {
    path: 'admin',
    component: Admin,
    children: [],
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'vehicules',
    component: VehiculeList,
  },
  {
    path: 'mecaniciens',
    component: MecanicienList,
  },
  {
    path: 'historique',
    component: InterventionHistory,
  },
  {
    path: 'interventions',
    component: InterventionList,
  },
];
