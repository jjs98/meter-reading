import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';

import { DataStore } from './../store/data.store';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly dataStore = inject(DataStore);
  private readonly navigationService = inject(NavigationService);

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkUserLogin(next, state.url);
  }
  public canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  public checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    if (this.dataStore.isTokenValid()) {
      const userRoles = this.dataStore.token()?.role ?? [];
      if (route.data['role'] && userRoles.indexOf(route.data['role']) === -1) {
        this.navigationService.navigateToHome();
        return false;
      }

      return true;
    }

    this.navigationService.navigateToLogin(url);
    return false;
  }
}
