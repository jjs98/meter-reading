import { inject } from '@angular/core';
import {
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { MeterService } from '../../api/services/meter.service';
import { Meter } from '../../models/meter';
import { TranslateService } from '../../services/translate.service';
import { patch } from '../../utils/data-store.utils';

interface MetersState {
  meters: Meter[];
}

const metersState = signalState<MetersState>({
  meters: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods(
      (
        store,
        meterService = inject(MeterService),
        toastService = inject(ToastService),
        translations = inject(TranslateService).translations
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ) => ({
        setMeters(meters: Meter[]): void {
          patch(store, (draft): void => {
            draft.meters = meters;
          });
        },
        async refreshMeters(): Promise<void> {
          const response = await meterService.getMetersEndpoint();
          if (response.status === 200) {
            const meters = response.body as Meter[];
            this.setMeters(meters);
          }
        },
        async addMeter(meter: Meter): Promise<boolean> {
          const response = await meterService.createMeterEndpoint({
            body: {
              userId: meter.userId,
              location: meter.location!,
              meterNumber: meter.meterNumber,
              addition: meter.addition,
              type: meter.type,
            },
          });
          if (response.status === 201) {
            await this.refreshMeters();
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.meter_success_add(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.meter_error_add(),
          });
          return false;
        },
        async deleteMeter(meterId: number): Promise<boolean> {
          const response = await meterService.deleteMeterEndpoint({
            id: meterId,
          });
          if (response.status === 204) {
            await this.refreshMeters();
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.meter_success_delete(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.meter_error_delete(),
          });
          return false;
        },
        async updateMeter(meter: Meter): Promise<boolean> {
          if (!meter.id) {
            toastService.add({
              severity: ToastSeverity.Error,
              summary: translations.error(),
              detail: translations.meter_error_meterIdMissing(),
            });
            return false;
          }
          const response = await meterService.updateMeterEndpoint({
            id: meter.id,
            body: {
              userId: meter.userId,
              location: meter.location!,
              meterNumber: meter.meterNumber,
              addition: meter.addition,
              type: meter.type,
            },
          });
          if (response.status === 204) {
            await this.refreshMeters();
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.meter_success_update(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.meter_error_update(),
          });
          return false;
        },
      })
    )
  );
}
