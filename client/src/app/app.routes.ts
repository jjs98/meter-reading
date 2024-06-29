import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'meter',
    loadComponent: () =>
      import('./components/meter/meter.component').then(
        (m) => m.MeterComponent
      ),
  },
  { path: '', redirectTo: 'meter', pathMatch: 'full' },
  { path: '**', redirectTo: 'meter' },
];
