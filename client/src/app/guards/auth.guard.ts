import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { MessageService } from 'primeng/api';

import { NavigationService } from '../services/navigation.service';
import { TranslateService } from '../services/translate.service';
import { DataStore } from '../store/data.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly dataStore = inject(DataStore);
  private readonly navigationService = inject(NavigationService);
  private readonly messageService = inject(MessageService);
  private readonly translations = inject(TranslateService).translations;

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkUserLogin(next, state.url);
  }
  public canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state);
  }

  public checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    if (this.dataStore.isTokenValid()) {
      const userRoles = this.dataStore.token()?.role ?? [];
      if (route.data['role'] && userRoles.indexOf(route.data['role']) === -1) {
        this.dataStore.deleteToken();
        this.messageService.add({
          severity: 'error',
          summary: this.translations.error(),
          detail: this.translations.login_error_noRights(),
        });
        this.navigationService.navigateToLogin();
        return false;
      }

      return true;
    }

    this.navigationService.navigateToLogin(url);
    return false;
  }
}
