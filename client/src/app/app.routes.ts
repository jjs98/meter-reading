import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'meters',
    canActivate: [AuthGuard],
    data: { role: 'User' },
    loadComponent: () =>
      import('./components/meter-list/meter-list.component').then(
        (m) => m.MeterComponent
      ),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: 'meters', pathMatch: 'full' },
];
