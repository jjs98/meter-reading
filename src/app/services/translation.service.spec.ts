import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';
import { TranslocoService } from '@jsverse/transloco';

let translocoServiceMock: {
  getActiveLang: jest.Mock;
  setActiveLang: jest.Mock;
};

describe('TranslationService', () => {
  let service: TranslationService;

  translocoServiceMock = {
    getActiveLang: jest.fn(),
    setActiveLang: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoServiceMock
        }
      ]
    });

    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
