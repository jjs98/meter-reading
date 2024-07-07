import { DataStore } from './../store/data.store';
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
  private readonly dataStore = inject(DataStore);
  private authService = inject(AuthService);
  public isTokenValid = computed(
    () => !this.isTokenExpired(this.dataStore.token())
  );

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

  public deleteToken(): void {
    this.setToken(undefined);
  }

  public setToken(token: string | undefined): void {
    if (!token) {
      localStorage.removeItem('token');
      this.dataStore.setToken(undefined);
      return;
    }
    localStorage.setItem('token', token ?? '');
    const decodedToken = this.decodeToken(token ?? '');
    this.dataStore.setToken(decodedToken);
  }

  private isTokenExpired(token: Token | undefined): boolean {
    if (!token) {
      return true;
    }
    return Date.now() >= token.exp * 1000;
  }

  private decodeToken(token: string): Token {
    const decodedToken = jwtDecode<Token>(token);
    decodedToken.tokenString = token;
    return decodedToken;
  }
}
