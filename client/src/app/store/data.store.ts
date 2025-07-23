import { effect } from '@angular/core';
import { signalStore, withHooks } from '@ngrx/signals';

import { mapTokenToUser } from '../utils/token.utils';

import { withMeters } from './features/meters.feature';
import { withReadings } from './features/readings.feature';
import { withSharedMeters } from './features/shared-meters.feature';
import { withToken } from './features/token.feature';
import { withUser } from './features/user.feature';

export const DataStore = signalStore(
  { providedIn: 'root' },
  withUser(),
  withToken(),
  withMeters(),
  withReadings(),
  withSharedMeters(),
  withHooks({
    onInit(store) {
      store.loadToken();
      effect(
        () => {
          const token = store.token();
          const user = mapTokenToUser(token);
          store.setUser(user);
        },
        { allowSignalWrites: true }
      );
    },
  })
);
