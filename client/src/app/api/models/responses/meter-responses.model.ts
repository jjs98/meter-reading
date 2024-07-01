import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { MeterDto } from '../meter-dto';
import { ProblemDetails } from '../problem-details';

type GetMeterStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation getMeter
 */
export type GetMeterApiResponse<TStatus extends GetMeterStatusCodes = GetMeterStatusCodes> = (
    | ((HttpResponse<(MeterDto)[]>) & ({
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

type PostMeterStatusCodes =
  | (201)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postMeter
 */
export type PostMeterApiResponse<TStatus extends PostMeterStatusCodes = PostMeterStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 201;
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

type GetMeterIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getMeterId
 */
export type GetMeterIdApiResponse<TStatus extends GetMeterIdStatusCodes = GetMeterIdStatusCodes> = (
    | ((HttpResponse<MeterDto>) & ({
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

type PutMeterIdStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation putMeterId
 */
export type PutMeterIdApiResponse<TStatus extends PutMeterIdStatusCodes = PutMeterIdStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 204;
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

type DeleteMeterIdStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteMeterId
 */
export type DeleteMeterIdApiResponse<TStatus extends DeleteMeterIdStatusCodes = DeleteMeterIdStatusCodes> = (
    | ((HttpResponse<never>) & ({
          status: 204;
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

