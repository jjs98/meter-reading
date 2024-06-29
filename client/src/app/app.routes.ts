import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'meters',
    loadComponent: () =>
      import('./components/meter-list/meter-list.component').then(
        (m) => m.MeterComponent
      ),
  },
  { path: '', redirectTo: 'meters', pathMatch: 'full' },
  { path: '**', redirectTo: 'meters' },
];
