import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private activatedroute = inject(ActivatedRoute);

  public navigateToLogin(returnUrl: string | undefined = undefined): void {
    if (returnUrl) {
      this.navigateToWithReturn('/login', returnUrl);
      return;
    }
    this.navigateTo('/login');
  }

  public navigateToHome(): void {
    this.navigateTo('');
  }

  public navigateToWithReturn(url: string, returnUrl: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: returnUrl } });
  }

  public navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  public getReturnUrl(): string | undefined {
    const returlUrl =
      this.activatedroute.snapshot.queryParamMap.get('returnUrl');
    return returlUrl ?? undefined;
  }
}
