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

export function withUser() {
  return signalStoreFeature(
    withState(userState),
    withMethods((store) => ({
      setUser(user: User) {
        patchState(store, { user });
      },
      setMeters(meters: Meter[]) {
        patchState(store, (state) => ({
          user: { ...state.user, meters: meters },
        }));
      },
      setMeterReading(meterId: number, reading: Reading[]) {
        const state = getState(store);
        const meters = state.user?.meters?.map((m) =>
          m.id === meterId ? { ...m, readings: reading } : m
        );
        if (!meters) {
          return;
        }
        patchState(store, (state) => ({
          user: { ...state.user, meters: meters },
        }));
      },
    }))
  );
}
