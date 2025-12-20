import { Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { DeshboardComponent } from './deshboard/deshboard.component';

export const routes: Routes = [
    {path : '' , redirectTo:'Deshboard' , pathMatch:'full' },
    {path : 'login' , component : LoginComponent} ,
    {path : 'register' , component : RegisterComponent} ,
    {path : 'Deshboard' , component : DeshboardComponent} 
];
