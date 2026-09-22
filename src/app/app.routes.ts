import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Login } from './features/auth/login/login';
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { VehiculeList } from './features/vehicles/vehicleList/vehicule-list';
import { MecanicienList } from './features/mechanics/mecanicien-list/mecanicien-list';
import { InterventionHistory } from './features/historique/historique-list/intervention-history';
import { Register } from './features/auth/register/register';
import { Admin } from './features/admin/admin';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MecanicienCreate } from './features/mechanics/mecanicien-create/mecanicien-create';
import { VehiculeDetail } from './features/vehicles/vehicleDetails/vehicule-detail';
import { MecanicienDetail } from './features/users/mecanicien-detail/mecanicien-detail';
import { VehiculeCreate } from './features/vehicles/createVehicle/vehicule-create';
import { UtilisateurList } from './features/users/UserList/UserList';
import { CreateUser } from './features/users/CreateUser/createUser';
import { Home } from './shared/components/home/home';
import { ChangePassword } from './features/users/change-password/change-password';
import { Profile } from './shared/components/profile/profile';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: Home, data: { title: 'Home' } },

  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'register', component: Register, data: { title: 'Register' } },

  { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },

  { path: 'vehicles', component: VehiculeList, data: { title: 'Vehicles' } },
  { path: 'vehicles/create', component: VehiculeCreate, data: { title: 'Create Vehicle' } },
  { path: 'vehicles/update/:id', component: VehiculeCreate, data: { title: 'Update Vehicle' } },
  { path: 'vehicles/details/:id', component: VehiculeDetail, data: { title: 'Details' } },

  { path: 'mechanics', component: MecanicienList, data: { title: 'Mechanics' } },
  { path: 'mechanics/create', component: MecanicienCreate, data: { title: 'Create Mechanic' } },
  { path: 'mechanics/update/:id', component: MecanicienCreate, data: { title: 'Update Mechanic' }, },
  { path: 'mechanics/:id', component: MecanicienDetail, data: { title: 'Details' } },

  { path: 'interventions', component: InterventionList, data: { title: 'Inteventions' } },
  { path: 'interventions/create/:id', component: InterventionCreate, data: { title: 'Create Intervention' }, },
  { path: 'interventions/update/:id', component: InterventionCreate, data: { title: 'Update Intervention' }, },

  { path: 'histories', component: InterventionHistory, data: { title: 'Histories' } },
  { path: 'histories/intervention/:id', component: InterventionHistory, data: { title: 'Details' }, },

  { path: 'users', component: UtilisateurList, data: { title: 'Users' } },
  { path: 'users/create', component: CreateUser, data: { title: 'Create User' }, },
  { path: 'users/update/:id', component: CreateUser, data: { title: 'Update User' }, },
  { path: 'users/password/change/:id', component: ChangePassword, data: { title: 'Change password' }, },
  { path : 'profile/:id', component: Profile, data : { title : 'Profile' } },
  {
    path: 'admin', component: Admin,
    children: [],
  },
];
