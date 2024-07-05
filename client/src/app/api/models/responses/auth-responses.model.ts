import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ProblemDetails } from '../problem-details';

type PostApiAuthLoginStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiAuthLogin
 */
export type PostApiAuthLoginApiResponse<TStatus extends PostApiAuthLoginStatusCodes = PostApiAuthLoginStatusCodes> = (
    | ((HttpResponse<string>) & ({
          status: 200;
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
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PostApiAuthRefreshStatusCodes =
  | (200)
  | (400)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiAuthRefresh
 */
export type PostApiAuthRefreshApiResponse<TStatus extends PostApiAuthRefreshStatusCodes = PostApiAuthRefreshStatusCodes> = (
    | ((HttpResponse<string>) & ({
          status: 200;
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
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

