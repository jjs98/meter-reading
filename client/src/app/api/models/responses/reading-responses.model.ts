import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ProblemDetails } from '../problem-details';
import { Reading } from '../reading';

type GetApiReadingStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiReading
 */
export type GetApiReadingApiResponse<TStatus extends GetApiReadingStatusCodes = GetApiReadingStatusCodes> = (
    | ((HttpResponse<(Reading)[]>) & ({
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

type PostApiReadingStatusCodes =
  | (201)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiReading
 */
export type PostApiReadingApiResponse<TStatus extends PostApiReadingStatusCodes = PostApiReadingStatusCodes> = (
    | ((HttpResponse<Reading>) & ({
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

type GetApiReadingIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiReadingId
 */
export type GetApiReadingIdApiResponse<TStatus extends GetApiReadingIdStatusCodes = GetApiReadingIdStatusCodes> = (
    | ((HttpResponse<Reading>) & ({
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

type PutApiReadingIdStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation putApiReadingId
 */
export type PutApiReadingIdApiResponse<TStatus extends PutApiReadingIdStatusCodes = PutApiReadingIdStatusCodes> = (
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

type DeleteApiReadingIdStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteApiReadingId
 */
export type DeleteApiReadingIdApiResponse<TStatus extends DeleteApiReadingIdStatusCodes = DeleteApiReadingIdStatusCodes> = (
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

