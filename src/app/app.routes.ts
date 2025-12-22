import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { DeshboardComponent } from './deshboard/deshboard.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { guestGuard } from './core/guards/guest.guard';
import { VehicalspecComponent } from './vehicalspec/vehicalspec.component';

export const routes: Routes = [
    // {path : '' , redirectTo:'Deshboard' , pathMatch:'full' },
    {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'Dashboard', component: DeshboardComponent },
      {path: 'vehicalspecification/:id' , component : VehicalspecComponent}
    ]
    },
    {path : 'login' , component : LoginComponent , canActivate: [guestGuard]} ,
    {path : 'register' , component : RegisterComponent , canActivate: [guestGuard]} ,
    // {path : 'Deshboard' , component : DeshboardComponent , canActivate: [authGuard]} 
    {path: '**', redirectTo: 'Dashboard' }
];
