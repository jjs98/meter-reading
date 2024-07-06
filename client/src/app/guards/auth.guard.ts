import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  private tokenService = inject(TokenService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkUserLogin(next, state.url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean {
    return true;
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return true;
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: string): boolean {
    if (this.tokenService.isTokenValid()) {
      const userRoles = this.tokenService.token()?.role ?? [];
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
