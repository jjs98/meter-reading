import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideApi } from './api/services';
import { MeterClient } from './api/clients';
import { METER_CLIENT_DEFAULT_OPTIONS } from './api/clients/meter-client';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideApi({
      rootUrl: '/',
    }),
    {
      provide: METER_CLIENT_DEFAULT_OPTIONS,
      useValue: {
        baseUrl: environment.api.baseUrl,
        fetch: fetch,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    },
    {
      provide: MeterClient,
      deps: [METER_CLIENT_DEFAULT_OPTIONS],
    },
  ],
};
