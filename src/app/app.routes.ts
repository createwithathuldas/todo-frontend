import { Routes } from '@angular/router';
import { Home } from './Component/home/home';
import { Login } from './Component/login/login';
import { Register } from './Component/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '**',
    redirectTo: ''
  }
];
