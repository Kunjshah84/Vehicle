import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { guestGuard } from './core/guards/guest.guard';
import { LoginComponent } from './views/Auth/login/login.component';
import { RegisterComponent } from './views/Auth/register/register.component';
import { VehicalspecComponent } from './views/vehicle/vehicalspec/vehicalspec.component';
import { DeshboardComponent } from './views/vehicle/deshboard/deshboard.component';
import { ManagementComponent } from './views/vehicle/management/management.component';
import { roleGuard } from './core/guards/role.guard';
import { ShowVehiclesComponent } from './views/vehicle/management/show-vehicles/show-vehicles.component';
import { AddVehicleComponent } from './views/vehicle/management/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './views/vehicle/management/edit-vehicle/edit-vehicle.component';
import { BookRideComponent } from './views/Booking/ride-confirmation/ride-confirmation.component';
import { PendingRequestsComponent } from './views/vehicle/management/pending-requests/pending-requests.component';
import { UserBookingsComponent } from './views/Booking/user-bookings/user-bookings.component';
import { userGuard } from './core/guards/user.guard';
export const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DeshboardComponent },
      { path: 'vehicalspecification/:id', component: VehicalspecComponent },
      { path: 'book-ride/:id', component: BookRideComponent },
      { path: 'my-bookings', component: UserBookingsComponent, canActivate: [userGuard]},
      { path: 'vehicle-management', component: ManagementComponent, canActivate: [roleGuard],
        children: [
          { path: '', redirectTo: 'show-vehicles', pathMatch: 'full' },
          { path: 'show-vehicles', component: ShowVehiclesComponent },
          { path: 'add-vehicle', component: AddVehicleComponent },
          { path: 'show-vehicles/:id/edit', component: EditVehicleComponent },
          { path: 'AllpendingReq', component: PendingRequestsComponent}
        ]}
    ]
  },

{ path: '**', component: DeshboardComponent }
];
