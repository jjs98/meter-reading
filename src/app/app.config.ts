import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoPipe } from '@jsverse/transloco';

import translocoConfig from '../../transloco.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, ClarityModule, TranslocoPipe),
    provideAnimations(), provideHttpClient(), provideTransloco({
      config: {
        availableLangs: translocoConfig.availableLangs,
        defaultLang: translocoConfig.defaultLang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
  ],
};
