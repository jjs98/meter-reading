import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { ChangePasswordEndpointRequest } from '../models/change-password-endpoint-request';
import type { HashEndpointRequest } from '../models/hash-endpoint-request';
import type { LoginEndpointRequest } from '../models/login-endpoint-request';
import type { ChangePasswordEndpointApiResponse, HashEndpointApiResponse, LoginEndpointApiResponse, RefreshEndpointApiResponse } from '../models/responses/auth-responses.model';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation changePasswordEndpoint
 */
type ChangePasswordEndpointParams = {
    body: ChangePasswordEndpointRequest;
  };

/**
 * Parameters for operation hashEndpoint
 */
type HashEndpointParams = {
    body: HashEndpointRequest;
  };

/**
 * Parameters for operation loginEndpoint
 */
type LoginEndpointParams = {
    body: LoginEndpointRequest;
  };

@Injectable()
export class AuthService extends ApiBaseService {
  private static readonly CHANGE_PASSWORD_ENDPOINT_PATH = '/api/auth/changePassword';
  private static readonly HASH_ENDPOINT_PATH = '/api/auth/hash';
  private static readonly LOGIN_ENDPOINT_PATH = '/api/auth/login';
  private static readonly REFRESH_ENDPOINT_PATH = '/api/auth/refresh';

  public changePasswordEndpoint(params: ChangePasswordEndpointParams, context?: HttpContext): AbortablePromise<ChangePasswordEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.CHANGE_PASSWORD_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<ChangePasswordEndpointApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: '*/*',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'json',
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public hashEndpoint(params: HashEndpointParams, context?: HttpContext): AbortablePromise<HashEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.HASH_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<HashEndpointApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'json',
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public loginEndpoint(params: LoginEndpointParams, context?: HttpContext): AbortablePromise<LoginEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.LOGIN_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<LoginEndpointApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'json',
          401: 'text',
          403: 'text',
          500: 'text',
        }
      }
    )
  }

  public refreshEndpoint(context?: HttpContext): AbortablePromise<RefreshEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, AuthService.REFRESH_ENDPOINT_PATH, 'post');

    return waitForResponse<RefreshEndpointApiResponse>(
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
