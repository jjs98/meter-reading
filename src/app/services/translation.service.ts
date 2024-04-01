import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { getLocalStorage, setLocalStorage } from '../utils/local-storage.utils';

import translocoConfig from '../../../transloco.config';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

const langLocalStorageKey = 'lang';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public readonly availableLangs =
    this.translocoService.getAvailableLangs() as string[];

  constructor(private translocoService: TranslocoService) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
    let lang = getLocalStorage(langLocalStorageKey);

    if (!lang || !this.availableLangs.includes(lang)) {
      const browserLang = navigator.language || navigator.languages[0];
      lang = browserLang?.split('-')[0];
    }

    if (!lang || !this.availableLangs.includes(lang)) {
      lang = this.translocoService.getDefaultLang();
    }

    this.setActiveLang(lang);
  }

  public getActiveLang() {
    return this.translocoService.getActiveLang();
  }

  public getActiveFullLang() {
    return this.getFullLang(this.translocoService.getActiveLang());
  }

  public getFullLang(lang: string) {
    return translocoConfig.fullLangs.find((fullLang) => fullLang.startsWith(lang)) ?? translocoConfig.defaultFullLang;
  }

  public getTranslation(key: string | undefined) {
    if (!key) {
      return key;
    }
    return this.translocoService.translate(key);
  }

  public setActiveLang(lang: string) {
    if (this.availableLangs.includes(lang)) {
      this.translocoService.setActiveLang(lang);
      setLocalStorage(langLocalStorageKey, lang);
    }
  }
}
