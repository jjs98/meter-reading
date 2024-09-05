import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import type { ProblemDetails } from '../problem-details';
import type { TokenDto } from '../token-dto';

type PostApiAuthLoginStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiAuthLogin
 */
export type PostApiAuthLoginApiResponse<TStatus extends PostApiAuthLoginStatusCodes = PostApiAuthLoginStatusCodes> = (
    | ((HttpResponse<TokenDto>) & ({
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
    | ((HttpResponse<TokenDto>) & ({
          status: 200;
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
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PostApiAuthChangePasswordStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiAuthChangePassword
 */
export type PostApiAuthChangePasswordApiResponse<TStatus extends PostApiAuthChangePasswordStatusCodes = PostApiAuthChangePasswordStatusCodes> = (
    | ((HttpResponse<TokenDto>) & ({
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
          error: (never) | (null);
          status: 500;
          ok: false;
        }))) & ({
      status: TStatus;
    });

type PostApiAuthHashStatusCodes =
  | (200)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiAuthHash
 */
export type PostApiAuthHashApiResponse<TStatus extends PostApiAuthHashStatusCodes = PostApiAuthHashStatusCodes> = (
    | ((HttpResponse<string>) & ({
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

