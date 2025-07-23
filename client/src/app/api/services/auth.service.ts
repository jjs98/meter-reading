import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { ChangePasswordDto } from '../models/change-password-dto';
import type { PostApiAuthChangePasswordApiResponse, PostApiAuthHashApiResponse, PostApiAuthLoginApiResponse, PostApiAuthRefreshApiResponse } from '../models/responses/auth-responses.model';
import type { UserLoginDto } from '../models/user-login-dto';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation postApiAuthLogin
 */
interface PostApiAuthLoginParams {
    body?: UserLoginDto;
  }

/**
 * Parameters for operation postApiAuthChangePassword
 */
interface PostApiAuthChangePasswordParams {
    body?: ChangePasswordDto;
  }

/**
 * Parameters for operation postApiAuthHash
 */
interface PostApiAuthHashParams {
    body?: string;
  }

@Injectable()
export class AuthService extends ApiBaseService {
  private static readonly POST_API_AUTH_LOGIN_PATH = '/api/Auth/login';
  private static readonly POST_API_AUTH_REFRESH_PATH = '/api/Auth/refresh';
  private static readonly POST_API_AUTH_CHANGE_PASSWORD_PATH = '/api/Auth/changePassword';
  private static readonly POST_API_AUTH_HASH_PATH = '/api/Auth/hash';

  public postApiAuthLogin(params?: PostApiAuthLoginParams, context?: HttpContext): AbortablePromise<PostApiAuthLoginApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.POST_API_AUTH_LOGIN_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiAuthLoginApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'json',
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
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'json',
          401: 'json',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public postApiAuthChangePassword(params?: PostApiAuthChangePasswordParams, context?: HttpContext): AbortablePromise<PostApiAuthChangePasswordApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.POST_API_AUTH_CHANGE_PASSWORD_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiAuthChangePasswordApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'json',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public postApiAuthHash(params?: PostApiAuthHashParams, context?: HttpContext): AbortablePromise<PostApiAuthHashApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.POST_API_AUTH_HASH_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiAuthHashApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }
}
