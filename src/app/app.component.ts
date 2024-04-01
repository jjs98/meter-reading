import { TranslationService } from './services/translation.service';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ClarityModule, TranslocoPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly languages = this.translationService.availableLangs;
  public readonly themes = this.themeService.themes;

  constructor(
    private translationService: TranslationService,
    private themeService: ThemeService,
  ) {}

  public setActiveLang(lang: string) {
    this.translationService.setActiveLang(lang);
  }

  public setTheme(theme: string) {
    this.themeService.setTheme(theme);
  }
}
