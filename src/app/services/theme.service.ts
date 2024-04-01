import { Injectable } from '@angular/core';
import { getLocalStorage, setLocalStorage } from '../utils/local-storage.utils';

const themeLocalStorageKey = 'theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public readonly themes = ['light', 'dark'];

  constructor() {
    let theme = getLocalStorage(themeLocalStorageKey);

    if (!theme || !this.themes.includes(theme)) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    this.setTheme(theme);
  }

  public setTheme(theme: string) {
    if (this.themes.includes(theme)) {
      document.body.setAttribute('cds-theme', theme);
      setLocalStorage(themeLocalStorageKey, theme);
    }
  }
}
