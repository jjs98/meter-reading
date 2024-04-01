import { ThemeService } from './theme.service';
import { TestBed } from '@angular/core/testing';

const themeLocalStorageKey = 'theme';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  function setThemeAndCheckInitial(
    theme: string,
    expectedInitialTheme: string,
  ) {
    localStorage.setItem(themeLocalStorageKey, theme);
    service = TestBed.inject(ThemeService);
    expect(getBodyTheme()).toBe(expectedInitialTheme);
  }

  function getBodyTheme() {
    return document.body.getAttribute('cds-theme');
  }

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it.each([
    ['light', 'light'],
    ['invalid', 'light'],
  ])('should set initial theme based on localStorage', (input, expected) => {
    setThemeAndCheckInitial(input, expected);
  });

  it('should switch theme', () => {
    setThemeAndCheckInitial('light', 'light');
    service.setTheme('dark');
    expect(getBodyTheme()).toBe('dark');
  });

  it('should not switch theme when invalid', () => {
    setThemeAndCheckInitial('light', 'light');
    service.setTheme('invalid');
    expect(getBodyTheme()).toBe('light');
  });
});
