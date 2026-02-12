import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { CreateReadingEndpointResponse } from '../create-reading-endpoint-response';
import type { ErrorResponse } from '../error-response';
import type { GetReadingsEndpointResponse } from '../get-readings-endpoint-response';

type GetReadingsEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getReadingsEndpoint
 */
export type GetReadingsEndpointApiResponse<TStatus extends GetReadingsEndpointStatusCodes = GetReadingsEndpointStatusCodes> = (
    | ((HttpResponse<(GetReadingsEndpointResponse)[]>) & ({
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

type CreateReadingEndpointStatusCodes =
  | (201)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation createReadingEndpoint
 */
export type CreateReadingEndpointApiResponse<TStatus extends CreateReadingEndpointStatusCodes = CreateReadingEndpointStatusCodes> = (
    | ((HttpResponse<CreateReadingEndpointResponse>) & ({
          status: 201;
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
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type UpdateReadingEndpointStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation updateReadingEndpoint
 */
export type UpdateReadingEndpointApiResponse<TStatus extends UpdateReadingEndpointStatusCodes = UpdateReadingEndpointStatusCodes> = (
    | ((HttpResponse<unknown>) & ({
          status: 204;
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

type DeleteReadingEndpointStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteReadingEndpoint
 */
export type DeleteReadingEndpointApiResponse<TStatus extends DeleteReadingEndpointStatusCodes = DeleteReadingEndpointStatusCodes> = (
    | ((HttpResponse<unknown>) & ({
          status: 204;
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

