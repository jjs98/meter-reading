import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

import { Meter } from '../../api/models';
import { UserService } from '../../api/services';
import { MeterService } from '../../api/services/meter.service';
import { patch } from '../../utils/data-store.utils';

type SharedMetersState = {
  sharedMeters: SharedMeter[];
};

type SharedMeter = {
  meter: Meter;
  owner: string;
};

const metersState = signalState<SharedMetersState>({
  sharedMeters: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withSharedMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods(
      (store, meterService = inject(MeterService), userService = inject(UserService)) => ({
        setSharedMeters(sharedMeters: SharedMeter[]): void {
          patch(store, draft => {
            draft.sharedMeters = sharedMeters;
          });
        },
        async refreshSharedMeters(): Promise<void> {
          const response = await meterService.getApiMeterShared();
          if (response.status === 200) {
            const meters = response.body as Meter[];
            const sharedMeters: SharedMeter[] = [];

            for (let index = 0; index < meters.length; index++) {
              const meter = meters[index];
              const response = await userService.getApiUserIdName({ id: meter.userId });
              if (response.status === 200) {
                const owner = response.body as string;
                const sharedMeter: SharedMeter = { meter, owner: owner || '' };
                sharedMeters.push(sharedMeter);
              }
            }

            this.setSharedMeters(sharedMeters);
          }
        },
      })
    )
  );
}
