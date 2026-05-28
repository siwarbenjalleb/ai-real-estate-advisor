import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/properties', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'properties',
    loadComponent: () => import('./properties/property-list/property-list.component').then(m => m.PropertyListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'add-property',
    loadComponent: () => import('./properties/property-add/property-add.component').then(m => m.AddPropertyComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/properties' }
];