import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { Meter } from '../meter';
import type { MeterShareDto } from '../meter-share-dto';
import type { ProblemDetails } from '../problem-details';
import type { SharedMeter } from '../shared-meter';

type GetApiMeterStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation getApiMeter
 */
export type GetApiMeterApiResponse<TStatus extends GetApiMeterStatusCodes = GetApiMeterStatusCodes> = (
    | ((HttpResponse<(Meter)[]>) & ({
          status: 200;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PostApiMeterStatusCodes =
  | (201)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiMeter
 */
export type PostApiMeterApiResponse<TStatus extends PostApiMeterStatusCodes = PostApiMeterStatusCodes> = (
    | ((HttpResponse<Meter>) & ({
          status: 201;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type GetApiMeterIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiMeterId
 */
export type GetApiMeterIdApiResponse<TStatus extends GetApiMeterIdStatusCodes = GetApiMeterIdStatusCodes> = (
    | ((HttpResponse<Meter>) & ({
          status: 200;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PutApiMeterIdStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation putApiMeterId
 */
export type PutApiMeterIdApiResponse<TStatus extends PutApiMeterIdStatusCodes = PutApiMeterIdStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 204;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 400;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type DeleteApiMeterIdStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteApiMeterId
 */
export type DeleteApiMeterIdApiResponse<TStatus extends DeleteApiMeterIdStatusCodes = DeleteApiMeterIdStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 204;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type GetApiMeterSharedStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiMeterShared
 */
export type GetApiMeterSharedApiResponse<TStatus extends GetApiMeterSharedStatusCodes = GetApiMeterSharedStatusCodes> = (
    | ((HttpResponse<(Meter)[]>) & ({
          status: 200;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type GetApiMeterSharedMeterIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiMeterSharedMeterId
 */
export type GetApiMeterSharedMeterIdApiResponse<TStatus extends GetApiMeterSharedMeterIdStatusCodes = GetApiMeterSharedMeterIdStatusCodes> = (
    | ((HttpResponse<(MeterShareDto)[]>) & ({
          status: 200;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PostApiMeterShareStatusCodes =
  | (201)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation postApiMeterShare
 */
export type PostApiMeterShareApiResponse<TStatus extends PostApiMeterShareStatusCodes = PostApiMeterShareStatusCodes> = (
    | ((HttpResponse<SharedMeter>) & ({
          status: 201;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type DeleteApiMeterRevokeStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteApiMeterRevoke
 */
export type DeleteApiMeterRevokeApiResponse<TStatus extends DeleteApiMeterRevokeStatusCodes = DeleteApiMeterRevokeStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 204;
          ok: true;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 401;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 403;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (ProblemDetails) | (null);
          status: 404;
          ok: false;
        }))
    | ((HttpErrorResponse) & ({
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

