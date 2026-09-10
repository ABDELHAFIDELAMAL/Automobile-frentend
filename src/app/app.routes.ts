import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { VehiculeList } from './features/vehicules/vehicule-list/vehicule-list';
import { MecanicienList } from './features/mecaniciens/mecanicien-list/mecanicien-list';
import { InterventionHistory } from './features/historique/historique-list/intervention-history';
import { Register } from './features/auth/register/register';
import { Admin } from './features/admin/admin';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MecanicienCreate } from './features/mecaniciens/mecanicien-create/mecanicien-create';
import { VehiculeDetail } from './features/vehicules/vehicule-detail/vehicule-detail';
import { MecanicienDetail } from './features/mecaniciens/mecanicien-detail/mecanicien-detail';
import { VehiculeCreate } from './features/vehicules/vehicule-create/vehicule-create';
import { UtilisateurList } from './features/utilisateur/utilisateur-list/utilisateur-list';
import { UtilisateurCreate } from './features/utilisateur/utilisateur-create/utilisateur-create';
import { UtilisateurDetail } from './features/utilisateur/utilisateur-detail/utilisateur-detail';
import { Home } from './shared/components/home/home';
import { ChangePassword } from './features/utilisateur/ChangePassword/change-password/change-password';
import { Profile } from './shared/components/profile/profile';



export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, data: { title: 'Home' } },

  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'register', component: Register, data: { title: 'Register' } },

  { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },

  { path: 'vehicules', component: VehiculeList, data: { title: 'Vehicules' } },
  { path: 'vehicules/create', component: VehiculeCreate, data: { title: 'Create Vehicule' } },
  { path: 'vehicules/update/:id', component: VehiculeCreate, data: { title: 'Update Vehicule' } },
  { path: 'vehicules/details/:id', component: VehiculeDetail, data: { title: 'Details' } },

  { path: 'mecaniciens', component: MecanicienList, data: { title: 'Mecaniciens' } },
  { path: 'create/mecanicien', component: MecanicienCreate, data: { title: 'Create Mecanicien' } },
  { path: 'mecaniciens/update/:id', component: MecanicienCreate, data: { title: 'Update Mecanicien' }, },
  { path: 'mecaniciens/:id', component: MecanicienDetail, data: { title: 'Details' } },

  { path: 'interventions', component: InterventionList, data: { title: 'Inteventions' } },
  { path: 'interventions/create', component: InterventionCreate, data: { title: 'Create Intervention' }, },
  { path: 'interventions/update/:id', component: InterventionCreate, data: { title: 'Update Intervention' }, },

  { path: 'historiques', component: InterventionHistory, data: { title: 'Historiques' } },
  { path: 'historiques/intervention/:id', component: InterventionHistory, data: { title: 'Details' }, },

  { path: 'utilisateurs', component: UtilisateurList, data: { title: 'Utilisateurs' } },
  { path: 'utilisateurs/create', component: UtilisateurCreate, data: { title: 'Create Utilisateur' }, },
  { path: 'utilisateurs/update/:id', component: VehiculeCreate, data: { title: 'Update Utilisateur' }, },
  { path: 'utilisateurs/password/change/:id', component: ChangePassword, data: { title: 'Change password' }, },
  { path: 'utilisateurs/details/:id', component: UtilisateurDetail, data: { title: 'Details' } },

  { path : 'profile', component: Profile, data : { title : 'Profile' } },
  {
    path: 'admin',
    component: Admin,
    children: [],
  },
];
