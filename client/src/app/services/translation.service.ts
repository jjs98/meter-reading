import { Injectable } from '@angular/core';
import { BaseTranslateService } from '@ngneers/signal-translate';

import type translations from '../i18n/en.json';

@Injectable({
  providedIn: 'root',
})
export class TranslationService extends BaseTranslateService<typeof translations> {
  constructor() {
    super(
      // Provide the available languages
      ['en', 'de'],
      // Provide the initial language (if null the browser language (navigator.language) is used)
      null
    );
  }

  protected loadTranslations(lang: string): Promise<typeof translations> {
    // Load the translations for the given language
    switch (lang) {
      case 'en':
        return import('../i18n/en.json').then(x => x.default);
      case 'de':
        return import('../i18n/de.json').then(x => x.default);
      default:
        // Only languages that are in the available languages array are passed
        // so this should never happen
        throw new Error(`Language ${lang} is not supported`);
    }
  }
}
