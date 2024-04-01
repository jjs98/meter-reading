import { Component } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslocoPipe],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private translationService: TranslocoService) { }

  switchLanguage() {
    let activeLang = this.translationService.getActiveLang();

    activeLang = activeLang === 'en' ? 'de' : 'en';

    this.translationService.setActiveLang(activeLang);
  }
}
