import { inject } from '@angular/core';
import {
  signalState,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { UserService } from '../../api/services';
import { MeterService } from '../../api/services/meter.service';
import { Meter } from '../../models/meter';
import { MeterShare } from '../../models/meter-share';
import { TranslateService } from '../../services/translate.service';
import { patch } from '../../utils/data-store.utils';

interface SharedMetersState {
  sharedMeters: SharedMeter[];
}

export interface SharedMeter {
  meter: Meter;
  owner: string;
}

const metersState = signalState<SharedMetersState>({
  sharedMeters: [],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function withSharedMeters() {
  return signalStoreFeature(
    withState(metersState),
    withMethods(
      (
        store,
        meterService = inject(MeterService),
        userService = inject(UserService),
        toastService = inject(ToastService),
        translations = inject(TranslateService).translations
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ) => ({
        setSharedMeters(sharedMeters: SharedMeter[]): void {
          patch(store, (draft): void => {
            draft.sharedMeters = sharedMeters;
          });
        },
        async refreshSharedMeters(): Promise<void> {
          const response = await meterService.getSharedMetersEndpoint();
          if (response.status === 200) {
            const meters = response.body ?? [];
            const sharedMeters: SharedMeter[] = [];

            for (const meter of meters) {
              const response = await userService.getUserNameEndpoint({
                id: meter.userId ?? -1,
              });
              if (response.status === 200) {
                const owner = response.body ?? '';
                const sharedMeter: SharedMeter = {
                  meter: {
                    id: meter.id,
                    userId: meter.userId,
                    location: meter.location,
                    meterNumber: meter.meterNumber,
                    addition: meter.addition,
                    type: meter.type,
                  },
                  owner,
                };
                sharedMeters.push(sharedMeter);
              }
            }

            this.setSharedMeters(sharedMeters);
          }
        },
        async shareMeter(meterId: number, username: string): Promise<boolean> {
          const response = await meterService.shareMeterEndpoint({
            body: { meterId, username },
          });
          if (response.status === 200) {
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.meterShare_success_add(),
            });
            return true;
          }
          if (response.status === 404) {
            toastService.add({
              severity: ToastSeverity.Error,
              summary: translations.error(),
              detail: translations.meterShare_error_notFound(),
            });
            return false;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.meterShare_error_add(),
          });
          return false;
        },
        async revokeMeterShare(
          meterId: number,
          userId: number
        ): Promise<boolean> {
          const response = await meterService.revokeMeterEndpoint({
            body: { meterId, userId },
          });
          if (response.status === 204) {
            toastService.add({
              severity: ToastSeverity.Success,
              summary: translations.success(),
              detail: translations.meterShare_success_delete(),
            });
            return true;
          }
          toastService.add({
            severity: ToastSeverity.Error,
            summary: translations.error(),
            detail: translations.meterShare_error_delete(),
          });
          return false;
        },
        async getSharedMeter(meterId: number): Promise<MeterShare[]> {
          const response = await meterService.getSharedByMeterIdEndpoint({
            meterId,
          });
          if (response.status === 200) {
            return response.body as MeterShare[];
          }
          return [];
        },
      })
    )
  );
}
