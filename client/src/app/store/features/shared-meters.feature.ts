import { inject } from '@angular/core';
import { signalState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { MessageService } from 'primeng/api';

import { Meter, MeterShareDto } from '../../api/models';
import { UserService } from '../../api/services';
import { MeterService } from '../../api/services/meter.service';
import { TranslateService } from '../../services/translate.service';
import { patch } from '../../utils/data-store.utils';

type SharedMetersState = {
  sharedMeters: SharedMeter[];
};

export type SharedMeter = {
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
      (
        store,
        meterService = inject(MeterService),
        userService = inject(UserService),
        messageService = inject(MessageService),
        translations = inject(TranslateService).translations
      ) => ({
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
        async shareMeter(meterId: number, username: string): Promise<boolean> {
          const response = await meterService.postApiMeterShare({ body: { meterId, username } });
          if (response.status === 201) {
            messageService.add({
              severity: 'success',
              summary: translations.success(),
              detail: translations.meterShare_success_add(),
            });
            return true;
          }
          if (response.status === 404) {
            messageService.add({
              severity: 'error',
              summary: translations.error(),
              detail: translations.meterShare_error_notFound(),
            });
            return false;
          }
          messageService.add({
            severity: 'error',
            summary: translations.error(),
            detail: translations.meterShare_error_add(),
          });
          return false;
        },
        async revokeMeterShare(meterId: number, userId: number): Promise<boolean> {
          const response = await meterService.deleteApiMeterRevoke({ body: { meterId, userId } });
          if (response.status === 204) {
            messageService.add({
              severity: 'success',
              summary: translations.success(),
              detail: translations.meterShare_success_delete(),
            });
            return true;
          }
          messageService.add({
            severity: 'error',
            summary: translations.error(),
            detail: translations.meterShare_error_delete(),
          });
          return false;
        },
        async getSharedMeter(meterId: number): Promise<MeterShareDto[]> {
          const response = await meterService.getApiMeterSharedMeterId({ meterId });
          if (response.status === 200) {
            return response.body as MeterShareDto[];
          }
          return [];
        },
      })
    )
  );
}
