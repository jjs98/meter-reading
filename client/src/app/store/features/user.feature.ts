import {
  getState,
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

import { User } from '../../api/models';
import { patch } from '../../utils/data-store.utils';

interface UserState {
  user: User | undefined;
}

const userState = signalState<UserState>({
  user: {
    username: '',
    password: '',
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withUser() {
  return signalStoreFeature(
    withState(userState),
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    withMethods((store) => ({
      setUser(user: User | undefined): void {
        patch(store, (draft): void => {
          draft.user = user;
        });
      },
      getUserName(): string {
        const state = getState(store);
        if (!state.user?.firstName && !state.user?.lastName) {
          return state.user?.username ?? '';
        } else {
          return `${state.user?.firstName ?? ''} ${state.user?.lastName ?? ''}`;
        }
      },
    }))
  );
}
