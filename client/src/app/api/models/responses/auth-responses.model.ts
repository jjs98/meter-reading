import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { ErrorResponse } from '../error-response';
import type { HashEndpointResponse } from '../hash-endpoint-response';
import type { LoginEndpointResponse } from '../login-endpoint-response';
import type { RefreshEndpointResponse } from '../refresh-endpoint-response';

type ChangePasswordEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation changePasswordEndpoint
 */
export type ChangePasswordEndpointApiResponse<TStatus extends ChangePasswordEndpointStatusCodes = ChangePasswordEndpointStatusCodes> = (
    | ((HttpResponse<unknown>) & ({
          status: 200;
          ok: true;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (ErrorResponse) | (null);
          status: 400;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (string) | (null);
          status: 401;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 403;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type HashEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation hashEndpoint
 */
export type HashEndpointApiResponse<TStatus extends HashEndpointStatusCodes = HashEndpointStatusCodes> = (
    | ((HttpResponse<HashEndpointResponse>) & ({
          status: 200;
          ok: true;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (ErrorResponse) | (null);
          status: 400;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 401;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 403;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type LoginEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation loginEndpoint
 */
export type LoginEndpointApiResponse<TStatus extends LoginEndpointStatusCodes = LoginEndpointStatusCodes> = (
    | ((HttpResponse<LoginEndpointResponse>) & ({
          status: 200;
          ok: true;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (ErrorResponse) | (null);
          status: 400;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 401;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 403;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type RefreshEndpointStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation refreshEndpoint
 */
export type RefreshEndpointApiResponse<TStatus extends RefreshEndpointStatusCodes = RefreshEndpointStatusCodes> = (
    | ((HttpResponse<RefreshEndpointResponse>) & ({
          status: 200;
          ok: true;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 401;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 403;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (unknown) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

