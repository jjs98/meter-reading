import { AuthService } from '../services/auth.service';
import { MeterService } from '../services/meter.service';
import { ReadingService } from '../services/reading.service';
import { RoleService } from '../services/role.service';
import { UserRoleService } from '../services/user-role.service';
import { UserService } from '../services/user.service';

import { ApiConfiguration } from './api-configuration';

import type { Provider } from '@angular/core';

/**
 * Provides all the API services.
 */
export function provideApi(config?: ApiConfiguration): Provider {
  return [
    config ? { provide: ApiConfiguration, useValue: config } : ApiConfiguration,
    AuthService,
    MeterService,
    ReadingService,
    RoleService,
    UserService,
    UserRoleService
  ];
}
