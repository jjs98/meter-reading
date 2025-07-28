import { inject } from '@angular/core';
import {
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { Reading } from '../../api/models';
import { ReadingService } from '../../api/services';
import { TranslateService } from '../../services/translate.service';
import { patch } from '../../utils/data-store.utils';

interface ReadingsState {
  readings: Reading[];
}

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
        toastService = inject(ToastService),
        translations = inject(TranslateService).translations
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ) => ({
        setMeterReading(readings: Reading[]): void {
          patch(store, (draft): void => {
            draft.readings = readings;
          });
        },
        getMeterReading(meterId: number): Reading[] {
          return store.readings().filter((x): boolean => x.meterId === meterId);
        },
        async refreshReadings(meterId: number): Promise<void> {
          this.setMeterReading([]);
          const response = await readingService.getApiReading({
            meterId: meterId,
          });
          if (response.status === 200) {
            const readings = response.body as Reading[];
            this.setMeterReading(readings);
          }
        },
        async addReading(reading: Reading): Promise<boolean> {
          const response = await readingService.postApiReading({
            body: reading,
          });
          if (response.status === 201) {
            await this.refreshReadings(reading.meterId);
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.reading_success_add(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.reading_error_add(),
          });
          return false;
        },
        async deleteReading(
          readingId: number,
          meterId: number
        ): Promise<boolean> {
          const response = await readingService.deleteApiReadingId({
            id: readingId,
          });
          if (response.status === 204) {
            await this.refreshReadings(meterId);
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.reading_success_delete(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.reading_error_delete(),
          });
          return false;
        },
        async updateReading(reading: Reading): Promise<boolean> {
          if (!reading.id) {
            toastService.add({
              severity: ToastSeverity.Error,
              summary: translations.error(),
              detail: translations.reading_error_readingIdMissing(),
            });
            return false;
          }
          const response = await readingService.putApiReadingId({
            id: reading.id,
            body: reading,
          });
          if (response.status === 204) {
            await this.refreshReadings(reading.meterId);
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.reading_success_update(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.reading_error_update(),
          });
          return false;
        },
      })
    )
  );
}
