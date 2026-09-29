import { Routes } from '@angular/router';
import { InterventionList } from './features/interventions/intervention-list/intervention-list';
import { InterventionCreate } from './features/interventions/intervention-create/intervention-create';
import { MechanicCreate } from './features/mechanics/mecanicien-create/mechanic-create';
import { Home } from './shared/components/home/home';
import { MecanicienDetail } from './features/mechanics/mecanicien-detail/mecanicien-detail';
import { MechanicList } from './features/mechanics/mechanic-list/mechanic-list';
import { VehicleList } from './features/vehicles/vehicle-list/vehicle-list';
import { VehicleCreate } from './features/vehicles/createVehicle/vehicle-create';
import { VehicleDetail } from './features/vehicles/vehicleDetails/vehicle-detail';
import { InterventionHistories } from './features/historique/historique-list/intervention-history';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { adminGuard } from './guard/admin.guard';
import { Login } from './features/login/login';
import { NewApp } from './new-app/new-app';
import { SignUp } from './features/sign-up/sign-up';
import { authGuard } from './guard/auth.guard';



export const routes: Routes = [

  { path: 'sign-in', component: Login, data: { title: 'Sign-in' } },
  { path: 'sign-up', component: SignUp, data: { title: 'Sign-up' } },
  {
    path: '',
    component: NewApp,
    canActivate : [ authGuard] ,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home, data: { title: 'Home' } },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
      { path: 'vehicles', component: VehicleList, data: { title: 'Vehicles' } },
      {
        path: 'vehicles/create',
        component: VehicleCreate,
        data: { title: 'Create Vehicle' },
        canActivate: [adminGuard],
      },
      {
        path: 'vehicles/update/:id',
        component: VehicleCreate,
        data: { title: 'Update Vehicle' },
        canActivate: [adminGuard],
      },
      { path: 'vehicles/details/:id', component: VehicleDetail, data: { title: 'Details' } },

      { path: 'mechanics', component: MechanicList, data: { title: 'Mechanics' } },
      {
        path: 'mechanics/create',
        component: MechanicCreate,
        data: { title: 'Create Mechanic' },
        canActivate: [adminGuard],
      },
      {
        path: 'mechanics/update/:id',
        component: MechanicCreate,
        data: { title: 'Update Mechanic' },
        canActivate: [adminGuard],
      },
      { path: 'mechanics/:id', component: MecanicienDetail, data: { title: 'Details' } },

      { path: 'interventions', component: InterventionList, data: { title: 'Inteventions' } },
      {
        path: 'interventions/create/:id',
        component: InterventionCreate,
        data: { title: 'Create Intervention' },
        canActivate: [adminGuard],
      },
      {
        path: 'interventions/update/:id',
        component: InterventionCreate,
        data: { title: 'Update Intervention' },
        canActivate: [adminGuard],
      },

      {
        path: 'histories',
        component: InterventionHistories,
        data: { title: 'Histories' },
      },
      {
        path: 'histories/intervention/:id',
        component: InterventionHistories,
        data: { title: 'Details' },
      },
    ],
  },
];
