import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { ErrorResponse } from '../error-response';

type GetUserNameEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getUserNameEndpoint
 */
export type GetUserNameEndpointApiResponse<TStatus extends GetUserNameEndpointStatusCodes = GetUserNameEndpointStatusCodes> = (
    | ((HttpResponse<string>) & ({
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
          error: (string) | (null);
          status: 404;
          ok: false;
        }))
    | ((Omit<HttpErrorResponse, 'error'>) & ({
          error: (string) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

