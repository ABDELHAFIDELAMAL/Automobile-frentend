import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { MecanicienList } from './features/mecaniciens/mecanicien-list/mecanicien-list';
import { InterventionHistory } from './features/interventions/intervention-history/intervention-history';
import { Register } from './features/auth/register/register';
import { Admin } from './features/admin/admin';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MecanicienCreate } from './features/mecaniciens/mecanicien-create/mecanicien-create';
import { VehiculeCreate } from './features/vehicules/vehicule-create/vehicule-create';
import { VehiculeDetail } from './features/vehicules/vehicule-detail/vehicule-detail';
import { MecanicienDetail } from './features/mecaniciens/mecanicien-detail/mecanicien-detail';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'dashboard', component: Dashboard },

  { path: 'vehicules', component: VehiculeList },
  { path: 'vehicules/create', component: VehiculeCreate },
  { path: 'vehicules/update/:id', component: VehiculeCreate },
  { path: 'vehicules/details/:id', component: VehiculeDetail },

  { path: 'mecaniciens', component: MecanicienList },
  { path: 'create/mecanicien', component: MecanicienCreate },
  { path: 'mecanicien/:id', component: MecanicienDetail },

  { path: 'inteventions', component: InterventionList },
  { path: 'create/intervention', component: InterventionCreate },
  { path: 'historique', component: InterventionHistory },

  {
    path: 'admin',
    component: Admin,
    children: [],
  },
];
