import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((mod) => mod.HomeComponent)
  },
  {
    path: 'meters',
    loadComponent: () => import('./components/meters/meters.component').then((mod) => mod.MetersComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./components/analytics/analytics.component').then((mod) => mod.AnalyticsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then((mod) => mod.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
