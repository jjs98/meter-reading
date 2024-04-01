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
    loadComponent: () =>
      import('./components/home/home.component').then(
        (mod) => mod.HomeComponent,
      ),
    providers: [provideTranslocoScope('home')],
  },
  {
    path: 'meter-list',
    loadComponent: () =>
      import('./components/meter-list/meter-list.component').then(
        (mod) => mod.MeterListComponent,
      ),
    providers: [provideTranslocoScope('meterList')],
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./components/analytics/analytics.component').then(
        (mod) => mod.AnalyticsComponent,
      ),
    providers: [provideTranslocoScope('analytics')],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings/settings.component').then(
        (mod) => mod.SettingsComponent,
      ),
    providers: [provideTranslocoScope('settings')],
  },
  {
    path: '**',
    redirectTo: 'home',
    // add not found component
  },
];
