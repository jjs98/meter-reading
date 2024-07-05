import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PostApiAuthLoginApiResponse, PostApiAuthRefreshApiResponse } from '../models/responses/auth-responses.model';
import { UserLoginDto } from '../models/user-login-dto';
import { AbortablePromise, waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

/**
 * Parameters for operation postApiAuthLogin
 */
type PostApiAuthLoginParams = {
    body?: UserLoginDto;
  };

@Injectable()
export class AuthService extends ApiBaseService {
  private static readonly POST_API_AUTH_LOGIN_PATH = '/api/Auth/login';
  private static readonly POST_API_AUTH_REFRESH_PATH = '/api/Auth/refresh';

  public postApiAuthLogin(params?: PostApiAuthLoginParams, context?: HttpContext): AbortablePromise<PostApiAuthLoginApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.POST_API_AUTH_LOGIN_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiAuthLoginApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: 'text/plain',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'text',
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public postApiAuthRefresh(context?: HttpContext): AbortablePromise<PostApiAuthRefreshApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.POST_API_AUTH_REFRESH_PATH, 'post');

    return waitForResponse<PostApiAuthRefreshApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: 'text/plain',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'text',
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }
}
