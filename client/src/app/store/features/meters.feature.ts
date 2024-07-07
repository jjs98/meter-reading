import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

import { MeterService } from './../../api/services/meter.service';
import { Meter, Reading } from '../../api/models';
import { patch } from '../../utils/data-store.utils';

type MetersState = { meters: Meter[] };

const metersState = signalState<MetersState>({
  meters: [],
});

export function withMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods((store, meterService = inject(MeterService)) => ({
      setMeters(meters: Meter[]) {
        patch(store, draft => {
          draft.meters = meters;
        });
      },
      setMeterReading(meterId: number, reading: Reading[]) {
        patch(store, draft => {
          const meter = draft.meters.find(x => x.id === meterId);
          if (meter) {
            meter.readings = reading;
          }
        });
      },
      async refreshMeters() {
        const resonse = await meterService.getApiMeter();
        if (resonse.status === 200) {
          const meters = resonse.body as Meter[];
          this.setMeters(meters);
        }
      },
      async addMeter(meter: Meter) {
        const resonse = await meterService.postApiMeter({ body: meter });
        if (resonse.status === 201) {
          await this.refreshMeters();
        }
      },
    }))
  );
}
