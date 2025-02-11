import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { provideApi } from './api/services';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          // darkModeSelector: '.dark',
        },
      },
    }),

    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideApi({ rootUrl: environment.api.baseUrl }),
    { provide: MessageService },
    { provide: ConfirmationService },
  ],
};
