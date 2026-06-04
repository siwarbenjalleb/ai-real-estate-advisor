import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent)
      },
      {
        path: 'seller-dashboard',
        loadComponent: () => import('./pages/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
      },
      {
        path: 'properties',
        loadComponent: () => import('./properties/property-list/property-list.component').then(m => m.PropertyListComponent)
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('./properties/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
      },
      {
        path: 'add-property',
        loadComponent: () => import('./properties/property-add/property-add.component').then(m => m.AddPropertyComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
      },
      {
        path: 'mortgage-calculator',
        loadComponent: () => import('./pages/mortgage-calculator/mortgage-calculator.component').then(m => m.MortgageCalculatorComponent)
      },
      {
        path: 'market-analytics',
        loadComponent: () => import('./pages/market-analytics/market-analytics.component').then(m => m.MarketAnalyticsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }, 

      {
        path: 'seller-dashboard',
        loadComponent: () => import('./pages/seller-dashboard/seller-dashboard.component')
        .then(m => m.SellerDashboardComponent)
},
      
    ]
  },
  { path: '**', redirectTo: '/login' }
];