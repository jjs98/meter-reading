import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { getLocalStorage, setLocalStorage } from '../utils/local-storage.utils';

const langLocalStorageKey = 'lang';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public readonly availableLangs = (this.translocoService.getAvailableLangs() as string[]);

  constructor(private translocoService: TranslocoService) {
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

  public setActiveLang(lang: string) {
    if (this.availableLangs.includes(lang)) {
      this.translocoService.setActiveLang(lang);
      setLocalStorage(langLocalStorageKey, lang);
    }
  }
}
