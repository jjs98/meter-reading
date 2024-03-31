import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translocoService: TranslocoService) { }

  switchLanguage() {
    let activeLang = this.translocoService.getActiveLang();

    activeLang = activeLang === 'en' ? 'de' : 'en';

    this.translocoService.setActiveLang(activeLang);
  }
}
