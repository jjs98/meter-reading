import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MetersComponent } from './components/meters/meters.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'meters',
    component: MetersComponent
  },
  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
