import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

import { User } from '../../api/models';
import { patch } from '../../utils/data-store.utils';

type UserState = { user: User | undefined };

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
    withMethods(store => ({
      setUser(user: User | undefined): void {
        patch(store, draft => {
          draft.user = user;
        });
      },
    }))
  );
}
