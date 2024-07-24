import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

import { Meter } from '../../api/models';
import { MeterService } from '../../api/services/meter.service';
import { patch } from '../../utils/data-store.utils';

type SharedMetersState = {
  sharedMeters: Meter[];
};

const metersState = signalState<SharedMetersState>({
  sharedMeters: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withSharedMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods((store, meterService = inject(MeterService)) => ({
      setSharedMeters(sharedMeters: Meter[]): void {
        patch(store, draft => {
          draft.sharedMeters = sharedMeters;
        });
      },
      async refreshSharedMeters(): Promise<void> {
        const resonse = await meterService.getApiMeterShared();
        if (resonse.status === 200) {
          const sharedMeters = resonse.body as Meter[];
          this.setSharedMeters(sharedMeters);
        }
      },
    }))
  );
}
