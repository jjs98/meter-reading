import {
  patchState,
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Token } from '../../models/Token.type';

type TokenState = { token: Token | undefined };

const tokenState = signalState<TokenState>({
  token: undefined,
});

export function withToken() {
  return signalStoreFeature(
    withState(tokenState),
    withMethods((store) => ({
      setToken(token: Token | undefined) {
        patchState(store, { token });
      },
    }))
  );
}
