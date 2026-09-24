import { Routes } from '@angular/router';
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MechanicCreate } from './features/mechanics/mecanicien-create/mechanic-create';
import { CreateUser } from './features/users/create-user/create-user';
import { Home } from './shared/components/home/home';
import { ChangePassword } from './features/users/change-password/change-password';
import { Profile } from './shared/components/profile/profile';
import { UserList } from './features/users/user-list/user-list';
import { MecanicienDetail } from './features/mechanics/mecanicien-detail/mecanicien-detail';
import { MechanicList } from './features/mechanics/mechanic-list/mechanic-list';
import { VehicleList } from './features/vehicles/vehicle-list/vehicle-list';
import { VehicleCreate } from './features/vehicles/createVehicle/vehicle-create';
import { VehicleDetail } from './features/vehicles/vehicleDetails/vehicle-detail';
import { InterventionHistories } from './features/historique/historique-list/intervention-history';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';



export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, data: { title: 'Home' } },

  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },

  { path: 'vehicles', component: VehicleList, data: { title: 'Vehicles' } },
  { path: 'vehicles/create', component: VehicleCreate, data: { title: 'Create Vehicle' } },
  { path: 'vehicles/update/:id', component: VehicleCreate, data: { title: 'Update Vehicle' } },
  { path: 'vehicles/details/:id', component: VehicleDetail, data: { title: 'Details' } },

  { path: 'mechanics', component: MechanicList, data: { title: 'Mechanics' } },
  { path: 'mechanics/create', component: MechanicCreate, data: { title: 'Create Mechanic' } },
  { path: 'mechanics/update/:id', component: MechanicCreate, data: { title: 'Update Mechanic' }, },
  { path: 'mechanics/:id', component: MecanicienDetail, data: { title: 'Details' } },

  { path: 'interventions', component: InterventionList, data: { title: 'Inteventions' } },
  { path: 'interventions/create/:id', component: InterventionCreate, data: { title: 'Create Intervention' }, },
  { path: 'interventions/update/:id', component: InterventionCreate, data: { title: 'Update Intervention' }, },

  { path: 'histories', component: InterventionHistories, data: { title: 'Histories' } },
  { path: 'histories/intervention/:id', component: InterventionHistories, data: { title: 'Details' }, },

  { path: 'users', component: UserList, data: { title: 'Users' } },
  { path: 'users/create', component: CreateUser, data: { title: 'Create User' }, },
  { path: 'users/update/:id', component: CreateUser, data: { title: 'Update User' }, },
  { path: 'users/password/change/:id', component: ChangePassword, data: { title: 'Change password' }, },
  { path : 'profile/:id', component: Profile, data : { title : 'Profile' } },
];
