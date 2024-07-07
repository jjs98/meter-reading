import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

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

  public navigateBack(): void {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  public getReturnUrl(): string | undefined {
    return this.getRouteParam('returnUrl');
  }

  public getRouteParam(key: string): string | undefined {
    const param = this.activatedRoute.snapshot.paramMap.get(key);
    return param ?? undefined;
  }
}
