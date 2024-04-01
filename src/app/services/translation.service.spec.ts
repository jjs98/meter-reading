import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';
import { TranslocoService } from '@jsverse/transloco';
import { setLocalStorage } from '../utils/local-storage.utils';

const defaultLang = 'en';

describe('TranslationService', () => {
  let service: TranslationService;

  let translocoServiceMock: {
    getDefaultLang: jest.Mock;
    getActiveLang: jest.Mock;
    getAvailableLangs: jest.Mock;
    setActiveLang: jest.Mock;
  };

  beforeEach(() => {
    localStorage.clear();

    translocoServiceMock = {
      getDefaultLang: jest.fn().mockReturnValue(defaultLang),
      getActiveLang: jest.fn(),
      getAvailableLangs: jest.fn().mockReturnValue(['en', 'de']),
      setActiveLang: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoServiceMock,
        },
      ],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(TranslationService);
    expect(service).toBeTruthy();
  });

  it('should call setActiveLang with localStorage lang', () => {
    setLocalStorage('lang', 'de');
    service = TestBed.inject(TranslationService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenLastCalledWith('de');
  });

  it('should call setActiveLang with navigator.language', () => {
    service = TestBed.inject(TranslationService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenLastCalledWith(
      defaultLang,
    );
  });

  it('should call setActiveLang for valid lang', () => {
    service = TestBed.inject(TranslationService);
    const lang = 'de';
    service.setActiveLang(lang);
    expect(translocoServiceMock.setActiveLang).toHaveBeenLastCalledWith(lang);
  });

  it('should not call setActiveLang for invalid lang', () => {
    service = TestBed.inject(TranslationService);
    const lang = 'es';
    service.setActiveLang(lang);
    expect(translocoServiceMock.setActiveLang).not.toHaveBeenLastCalledWith(
      lang,
    );
  });

  it('should call setActiveLang with browser languages', () => {
    Object.defineProperty(navigator, 'language', {
      value: null,
      writable: true,
    });
    Object.defineProperty(navigator, 'languages', {
      value: ['de-DE'],
      writable: true,
    });
    service = TestBed.inject(TranslationService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenLastCalledWith('de');
  });

  it('should call setActiveLang with browser language', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'de-DE',
      writable: true,
    });
    service = TestBed.inject(TranslationService);
    expect(translocoServiceMock.setActiveLang).toHaveBeenLastCalledWith('de');
  });
});
