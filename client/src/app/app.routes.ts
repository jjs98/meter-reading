import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

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
          import('./pages/meter-details/meter-details.component').then(
            (m) => m.MeterDetailsComponent
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
