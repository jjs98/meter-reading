/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Route } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const appRoutes: Route[] = [
  {
    path: 'meters',
    canActivate: [AuthGuard],
    data: { role: 'User' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/meter-list/meter-list.component').then(
            (m) => m.MeterComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/reading-list/reading-list.component').then(
            (m) => m.ReadingListComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: 'meters', pathMatch: 'full' },
];
