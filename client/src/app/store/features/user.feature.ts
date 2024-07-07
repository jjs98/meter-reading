import {
  getState,
  patchState,
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';

import { Meter, Reading, User } from '../../api/models';

type UserState = { user: User };

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
      setUser(user: User): void {
        patchState(store, { user });
      },
      setMeters(meters: Meter[]): void {
        patchState(store, state => ({
          user: { ...state.user, meters: meters },
        }));
      },
      setMeterReading(meterId: number, reading: Reading[]): void {
        const state = getState(store);
        const meters = state.user?.meters?.map(m =>
          m.id === meterId ? { ...m, readings: reading } : m
        );
        if (!meters) {
          return;
        }
        patchState(store, state => ({
          user: { ...state.user, meters: meters },
        }));
      },
    }))
  );
}
