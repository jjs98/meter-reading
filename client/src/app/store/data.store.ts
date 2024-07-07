import { signalStore } from '@ngrx/signals';

import { withMeters } from './features/meters.feature';
import { withToken } from './features/token.feature';
import { withUser } from './features/user.feature';

export const DataStore = signalStore({ providedIn: 'root' }, withUser(), withToken(), withMeters());
