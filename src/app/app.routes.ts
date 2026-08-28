import { Routes } from '@angular/router';
import { Dashboard } from "./features/dashboard/dashboard";
import { Login } from "./features/auth/login/login";
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { MecanicienList } from './features/mecaniciens/mecanicien-list/mecanicien-list';
import { InterventionHistory } from './features/interventions/intervention-history/intervention-history';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'inteventions',
    component: InterventionList,
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
];
