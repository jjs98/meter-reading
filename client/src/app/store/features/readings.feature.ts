import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { MessageService } from 'primeng/api';

import { Reading } from '../../api/models';
import { ReadingService } from '../../api/services';
import { patch } from '../../utils/data-store.utils';

type ReadingsState = { readings: Reading[] };

const readingsState = signalState<ReadingsState>({
  readings: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withReadings() {
  return signalStoreFeature(
    withState(readingsState),
    withMethods(
      (
        store,
        readingService = inject(ReadingService),
        messageService = inject(MessageService)
      ) => ({
        setMeterReading(readings: Reading[]): void {
          patch(store, draft => {
            draft.readings = readings;
          });
        },
        getMeterReading(meterId: number): Reading[] {
          return store.readings().filter(x => x.meterId === meterId);
        },
        async refreshReadings(meterId: number): Promise<void> {
          const resonse = await readingService.getApiReading({ meterId: meterId });
          if (resonse.status === 200) {
            const readings = resonse.body as Reading[];
            this.setMeterReading(readings);
          }
        },
        async addReading(reading: Reading): Promise<boolean> {
          const resonse = await readingService.postApiReading({ body: reading });
          if (resonse.status === 201) {
            await this.refreshReadings(reading.meterId);
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add reading',
          });
          return false;
        },
      })
    )
  );
}
