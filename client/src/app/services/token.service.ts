import { AuthService } from './../api/services/auth.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../models/Token.type';
import { mergeMap, timer } from 'rxjs';
import { TokenDto } from '../api/models';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private authService = inject(AuthService);
  public token = signal<Token | undefined>(undefined);
  public isTokenValid = computed(() => !this.isTokenExpired(this.token()));

  constructor() {
    timer(0, 10 * 1000 * 60)
      .pipe(
        mergeMap((_) => {
          if (!this.isTokenValid()) {
            return Promise.resolve();
          }
          return this.authService.postApiAuthRefresh().then((response) => {
            if (response.status === 200) {
              const token = response.body as TokenDto;
              this.setToken(token.token ?? undefined);
            }
          });
        })
      )
      .subscribe();
  }

  public loadToken(): void {
    const token = localStorage.getItem('token');
    this.setToken(token ?? undefined);
  }

  public setToken(token: string | undefined): void {
    if (!token) {
      localStorage.removeItem('token');
      this.token.set(undefined);
    }
    localStorage.setItem('token', token ?? '');
    this.token.set(jwtDecode<Token>(token ?? ''));
  }

  public deleteToken(): void {
    localStorage.removeItem('token');
    this.token.set(undefined);
  }

  private isTokenExpired(token: Token | undefined): boolean {
    if (!token) {
      return true;
    }
    return Date.now() >= token.exp * 1000;
  }
}
