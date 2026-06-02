import { registerLocaleData } from '@angular/common';
import { Injectable, effect } from '@angular/core';
import { BaseTranslateService, TranslateKeys } from '@ngneers/signal-translate';

import { getLocalStorage, setLocalStorage } from '../utils/local-storage.utils';

import type en from '../i18n/en.json';

interface LangType {
  translations: typeof en;
  locale: unknown;
  localeExtra: unknown;
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
    const { translations, locale, localeExtra } = await langs[lang]();
    registerLocaleData(locale, lang, localeExtra);
    return translations;
  }
}
