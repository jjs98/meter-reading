import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { MessageService } from 'primeng/api';

import { Meter, Reading } from '../../api/models';
import { MeterService } from '../../api/services/meter.service';
import { patch } from '../../utils/data-store.utils';

type MetersState = { meters: Meter[] };

const metersState = signalState<MetersState>({
  meters: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods(
      (store, meterService = inject(MeterService), messageService = inject(MessageService)) => ({
        setMeters(meters: Meter[]): void {
          patch(store, draft => {
            draft.meters = meters;
          });
        },
        setMeterReading(meterId: number, reading: Reading[]): void {
          patch(store, draft => {
            const meter = draft.meters.find(x => x.id === meterId);
            if (meter) {
              meter.readings = reading;
            }
          });
        },
        async refreshMeters(): Promise<void> {
          const resonse = await meterService.getApiMeter();
          if (resonse.status === 200) {
            const meters = resonse.body as Meter[];
            this.setMeters(meters);
          }
        },
        async addMeter(meter: Meter): Promise<boolean> {
          const resonse = await meterService.postApiMeter({ body: meter });
          if (resonse.status === 201) {
            await this.refreshMeters();
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add meter',
          });
          return false;
        },
        async deleteMeter(meterId: number): Promise<boolean> {
          const resonse = await meterService.deleteApiMeterId({ id: meterId });
          if (resonse.status === 204) {
            await this.refreshMeters();
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete meter',
          });
          return false;
        },
      })
    )
  );
}
