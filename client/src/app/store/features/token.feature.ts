import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withHooks, withMethods, withState } from '@ngrx/signals';
import { jwtDecode } from 'jwt-decode';
import { timer, mergeMap } from 'rxjs';

import { TokenDto } from '../../api/models';
import { AuthService } from '../../api/services';
import { Token } from '../../models/Token.type';
import { patch } from '../../utils/data-store.utils';
import { getLocalStorage, setLocalStorage } from '../../utils/local-storage.utils';

interface TokenState { token: Token | undefined }

const tokenState = signalState<TokenState>({
  token: undefined,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withToken() {
  return signalStoreFeature(
    withState(tokenState),
    withMethods(store => ({
      setToken(token: Token | undefined): void {
        patch(store, draft => {
          draft.token = token;
        });
      },
      setTokenString(token: string | undefined): void {
        if (!token) {
          setLocalStorage('token', undefined);
          this.setToken(undefined);
          return;
        }
        setLocalStorage('token', token);
        const decodedToken = this.decodeToken(token ?? '');
        this.setToken(decodedToken);
      },
      loadToken(): void {
        const token = getLocalStorage('token');
        this.setTokenString(token ?? undefined);
      },
      deleteToken(): void {
        this.setTokenString(undefined);
      },
      isTokenValid(): boolean {
        const token = store.token();
        if (!token) {
          return false;
        }
        return Date.now() < token.exp * 1000;
      },
      decodeToken(token: string): Token {
        const decodedToken = jwtDecode<Token>(token);
        decodedToken.tokenString = token;
        return decodedToken;
      },
    })),
    withHooks({
      onInit: (store, authService = inject(AuthService)) => {
        store.loadToken();

        timer(0, 14 * 1000 * 60)
          .pipe(
            mergeMap(_ => {
              if (!store.isTokenValid()) {
                return Promise.resolve();
              }
              return authService.postApiAuthRefresh().then(response => {
                if (response.status === 200) {
                  const token = response.body as TokenDto;
                  store.setTokenString(token.token ?? undefined);
                }
              });
            })
          )
          .subscribe();
      },
    })
  );
}
