import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((mod) => mod.HomeComponent),
    providers: [
      provideTranslocoScope('home'),
    ],
  },
  {
    path: 'meters',
    loadComponent: () => import('./components/meters/meters.component').then((mod) => mod.MetersComponent),
    providers: [
      provideTranslocoScope('meters'),
    ],
  },
  {
    path: 'analytics',
    loadComponent: () => import('./components/analytics/analytics.component').then((mod) => mod.AnalyticsComponent),
    providers: [
      provideTranslocoScope('analytics'),
    ],
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then((mod) => mod.SettingsComponent),
    providers: [
      provideTranslocoScope('settings'),
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
