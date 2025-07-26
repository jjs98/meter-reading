import { registerLocaleData } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { BaseTranslateService, TranslateKeys } from '@ngneers/signal-translate';
import { PrimeNG } from 'primeng/config';

import { getLocalStorage, setLocalStorage } from '../utils/local-storage.utils';

import type en from '../i18n/en.json';
import type primengEn from '../i18n/primeng.en.json';

interface LangType {
  translations: typeof en;
  locale: unknown;
  localeExtra: unknown;
  primengTranslations: typeof primengEn;
}
const langs: Record<string, () => Promise<LangType>> = {
  en: (): Promise<LangType> =>
    import('../i18n/en').then((x): LangType => x.default),
  de: (): Promise<LangType> =>
    import('../i18n/de').then((x): LangType => x.default),
};

const langLocalStorageKey = 'lang';

export type TranslationKey = TranslateKeys<typeof en, '_'>;

@Injectable({ providedIn: 'root' })
export class TranslateService extends BaseTranslateService<typeof en> {
  private readonly _primengConfig = inject(PrimeNG);

  public constructor() {
    super(['en', 'de'], getLocalStorage(langLocalStorageKey));

    effect((): void => {
      if (this.isLanguage(null)) {
        setLocalStorage(langLocalStorageKey, null);
      } else {
        setLocalStorage(langLocalStorageKey, this.language());
      }
    });
  }

  public getLangDisplay(lang: string | null): string {
    lang ??= this.browserLanguage;
    switch (lang) {
      case 'en':
        return 'English';
      case 'de':
        return 'Deutsch';
      default:
        return lang;
    }
  }

  protected override async loadTranslations(lang: string): Promise<typeof en> {
    const { translations, locale, localeExtra, primengTranslations } =
      await langs[lang]();
    registerLocaleData(locale, lang, localeExtra);
    this._primengConfig.setTranslation(primengTranslations);
    return translations;
  }
}
