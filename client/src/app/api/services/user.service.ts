import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DeleteApiUserIdApiResponse, GetApiUserApiResponse, GetApiUserIdApiResponse, PostApiUserApiResponse, PutApiUserIdApiResponse } from '../models/responses/user-responses.model';
import { User } from '../models/user';
import { AbortablePromise, waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

/**
 * Parameters for operation postApiUser
 */
type PostApiUserParams = {
    body?: User;
  };

/**
 * Parameters for operation getApiUserId
 */
type GetApiUserIdParams = {
    id: number;
  };

/**
 * Parameters for operation putApiUserId
 */
type PutApiUserIdParams = {
    id: number;
    body?: User;
  };

/**
 * Parameters for operation deleteApiUserId
 */
type DeleteApiUserIdParams = {
    id: number;
  };

@Injectable()
export class UserService extends ApiBaseService {
  private static readonly GET_API_USER_PATH = '/api/User';
  private static readonly POST_API_USER_PATH = '/api/User';
  private static readonly GET_API_USER_ID_PATH = '/api/User/{id}';
  private static readonly PUT_API_USER_ID_PATH = '/api/User/{id}';
  private static readonly DELETE_API_USER_ID_PATH = '/api/User/{id}';

  public getApiUser(context?: HttpContext): AbortablePromise<GetApiUserApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_API_USER_PATH, 'get');

    return waitForResponse<GetApiUserApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: 'text/plain',
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

  public postApiUser(params?: PostApiUserParams, context?: HttpContext): AbortablePromise<PostApiUserApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.POST_API_USER_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiUserApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: 'text/plain',
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

  public getApiUserId(params: GetApiUserIdParams, context?: HttpContext): AbortablePromise<GetApiUserIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_API_USER_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiUserIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: 'text/plain',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'text',
          403: 'text',
          404: 'text',
          500: 'text',
        }
      }
    )
  }

  public putApiUserId(params: PutApiUserIdParams, context?: HttpContext): AbortablePromise<PutApiUserIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.PUT_API_USER_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutApiUserIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: '*/*',
        context,
      })),
      {
        errorResponseTypes: {
          400: 'text',
          401: 'text',
          403: 'text',
          404: 'text',
          500: 'text',
        }
      }
    )
  }

  public deleteApiUserId(params: DeleteApiUserIdParams, context?: HttpContext): AbortablePromise<DeleteApiUserIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.DELETE_API_USER_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteApiUserIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: '*/*',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'text',
          403: 'text',
          404: 'text',
          500: 'text',
        }
      }
    )
  }
}
