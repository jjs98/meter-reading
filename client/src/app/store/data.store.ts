import { signalStore } from '@ngrx/signals';
import { withUser } from './features/user.feature';
import { withToken } from './features/token.feature';

export const DataStore = signalStore(
  { providedIn: 'root' },
  withUser(),
  withToken()
);
