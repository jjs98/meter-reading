import { patchState, signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

import { Token } from '../../models/Token.type';

type TokenState = { token: Token | undefined };

const tokenState = signalState<TokenState>({
  token: undefined,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withToken() {
  return signalStoreFeature(
    withState(tokenState),
    withMethods(store => ({
      setToken(token: Token | undefined): void {
        patchState(store, { token });
      },
    }))
  );
}
