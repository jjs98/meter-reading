import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { CreateMeterEndpointResponse } from '../create-meter-endpoint-response';
import type { ErrorResponse } from '../error-response';
import type { GetMetersEndpointResponse } from '../get-meters-endpoint-response';
import type { GetSharedByMeterIdEndpointResponse } from '../get-shared-by-meter-id-endpoint-response';
import type { GetSharedMetersEndpointResponse } from '../get-shared-meters-endpoint-response';
import type { ShareMeterEndpointResponse } from '../share-meter-endpoint-response';

type GetMetersEndpointStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation getMetersEndpoint
 */
export type GetMetersEndpointApiResponse<TStatus extends GetMetersEndpointStatusCodes = GetMetersEndpointStatusCodes> = (
    | ((HttpResponse<(GetMetersEndpointResponse)[]>) & ({
          status: 200;
          ok: true;
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

type CreateMeterEndpointStatusCodes =
  | (201)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation createMeterEndpoint
 */
export type CreateMeterEndpointApiResponse<TStatus extends CreateMeterEndpointStatusCodes = CreateMeterEndpointStatusCodes> = (
    | ((HttpResponse<CreateMeterEndpointResponse>) & ({
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
          error: (unknown) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type UpdateMeterEndpointStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation updateMeterEndpoint
 */
export type UpdateMeterEndpointApiResponse<TStatus extends UpdateMeterEndpointStatusCodes = UpdateMeterEndpointStatusCodes> = (
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

type DeleteMeterEndpointStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteMeterEndpoint
 */
export type DeleteMeterEndpointApiResponse<TStatus extends DeleteMeterEndpointStatusCodes = DeleteMeterEndpointStatusCodes> = (
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

type GetSharedByMeterIdEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getSharedByMeterIdEndpoint
 */
export type GetSharedByMeterIdEndpointApiResponse<TStatus extends GetSharedByMeterIdEndpointStatusCodes = GetSharedByMeterIdEndpointStatusCodes> = (
    | ((HttpResponse<(GetSharedByMeterIdEndpointResponse)[]>) & ({
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

type GetSharedMetersEndpointStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getSharedMetersEndpoint
 */
export type GetSharedMetersEndpointApiResponse<TStatus extends GetSharedMetersEndpointStatusCodes = GetSharedMetersEndpointStatusCodes> = (
    | ((HttpResponse<(GetSharedMetersEndpointResponse)[]>) & ({
          status: 200;
          ok: true;
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

type RevokeMeterEndpointStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation revokeMeterEndpoint
 */
export type RevokeMeterEndpointApiResponse<TStatus extends RevokeMeterEndpointStatusCodes = RevokeMeterEndpointStatusCodes> = (
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

type ShareMeterEndpointStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation shareMeterEndpoint
 */
export type ShareMeterEndpointApiResponse<TStatus extends ShareMeterEndpointStatusCodes = ShareMeterEndpointStatusCodes> = (
    | ((HttpResponse<ShareMeterEndpointResponse>) & ({
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

