import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { MessageService } from 'primeng/api';

import { Reading } from '../../api/models';
import { ReadingService } from '../../api/services';
import { TranslateService } from '../../services/translate.service';
import { patch } from '../../utils/data-store.utils';

interface ReadingsState { readings: Reading[] }

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
        messageService = inject(MessageService),
        translations = inject(TranslateService).translations
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
          this.setMeterReading([]);
          const response = await readingService.getApiReading({ meterId: meterId });
          if (response.status === 200) {
            const readings = response.body as Reading[];
            this.setMeterReading(readings);
          }
        },
        async addReading(reading: Reading): Promise<boolean> {
          const response = await readingService.postApiReading({ body: reading });
          if (response.status === 201) {
            await this.refreshReadings(reading.meterId);
            messageService.add({
              severity: 'success',
              summary: translations.success(),
              detail: translations.reading_success_add(),
            });
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: translations.error(),
            detail: translations.reading_error_add(),
          });
          return false;
        },
        async deleteReading(readingId: number, meterId: number): Promise<boolean> {
          const response = await readingService.deleteApiReadingId({ id: readingId });
          if (response.status === 204) {
            await this.refreshReadings(meterId);
            messageService.add({
              severity: 'success',
              summary: translations.success(),
              detail: translations.reading_success_delete(),
            });
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: translations.error(),
            detail: translations.reading_error_delete(),
          });
          return false;
        },
        async updateReading(reading: Reading): Promise<boolean> {
          if (!reading.id) {
            messageService.add({
              severity: 'error',
              summary: translations.error(),
              detail: translations.reading_error_readingIdMissing(),
            });
            return false;
          }
          const response = await readingService.putApiReadingId({ id: reading.id, body: reading });
          if (response.status === 204) {
            await this.refreshReadings(reading.meterId);
            messageService.add({
              severity: 'success',
              summary: translations.success(),
              detail: translations.reading_success_update(),
            });
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: translations.error(),
            detail: translations.reading_error_update(),
          });
          return false;
        },
      })
    )
  );
}
