import { Provider } from '@angular/core';

import { MeterService } from '../services/meter.service';
import { ApiConfiguration } from './api-configuration';

/**
 * Provides all the API services.
 */
export function provideApi(config?: ApiConfiguration): Provider {
  return [config ? { provide: ApiConfiguration, useValue: config } : ApiConfiguration, MeterService];
}
