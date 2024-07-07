import { StateSignal, patchState } from '@ngrx/signals';
import { Prettify } from '@ngrx/signals/src/ts-helpers';
import { Draft, produce } from 'immer';

export function patch<TState extends object>(
  stateSignal: StateSignal<TState>,
  func: (draft: Draft<Prettify<TState>>) => void
) {
  patchState(stateSignal, x => produce(x, func));
}
