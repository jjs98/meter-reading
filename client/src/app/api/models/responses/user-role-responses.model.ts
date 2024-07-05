import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ProblemDetails } from '../problem-details';
import { UserRole } from '../user-role';

type GetApiUserRoleRoleRoleIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiUserRoleRoleRoleId
 */
export type GetApiUserRoleRoleRoleIdApiResponse<TStatus extends GetApiUserRoleRoleRoleIdStatusCodes = GetApiUserRoleRoleRoleIdStatusCodes> = (
    | ((HttpResponse<(UserRole)[]>) & ({
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

type GetApiUserRoleUserUserIdStatusCodes =
  | (200)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation getApiUserRoleUserUserId
 */
export type GetApiUserRoleUserUserIdApiResponse<TStatus extends GetApiUserRoleUserUserIdStatusCodes = GetApiUserRoleUserUserIdStatusCodes> = (
    | ((HttpResponse<(UserRole)[]>) & ({
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

type PostApiUserRoleStatusCodes =
  | (201)
  | (401)
  | (403)
  | (500);
/**
 * Response model for operation postApiUserRole
 */
export type PostApiUserRoleApiResponse<TStatus extends PostApiUserRoleStatusCodes = PostApiUserRoleStatusCodes> = (
    | ((HttpResponse<UserRole>) & ({
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

type PutApiUserRoleIdStatusCodes =
  | (204)
  | (400)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation putApiUserRoleId
 */
export type PutApiUserRoleIdApiResponse<TStatus extends PutApiUserRoleIdStatusCodes = PutApiUserRoleIdStatusCodes> = (
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

type DeleteApiUserRoleIdStatusCodes =
  | (204)
  | (401)
  | (403)
  | (404)
  | (500);
/**
 * Response model for operation deleteApiUserRoleId
 */
export type DeleteApiUserRoleIdApiResponse<TStatus extends DeleteApiUserRoleIdStatusCodes = DeleteApiUserRoleIdStatusCodes> = (
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

