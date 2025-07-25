import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { DeleteApiUserIdApiResponse, GetApiUserApiResponse, GetApiUserIdApiResponse, GetApiUserIdNameApiResponse, PostApiUserApiResponse, PutApiUserIdApiResponse } from '../models/responses/user-responses.model';
import type { User } from '../models/user';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation postApiUser
 */
interface PostApiUserParams {
    body?: User;
  }

/**
 * Parameters for operation getApiUserId
 */
interface GetApiUserIdParams {
    id: number;
  }

/**
 * Parameters for operation putApiUserId
 */
interface PutApiUserIdParams {
    id: number;
    body?: User;
  }

/**
 * Parameters for operation deleteApiUserId
 */
interface DeleteApiUserIdParams {
    id: number;
  }

/**
 * Parameters for operation getApiUserIdName
 */
interface GetApiUserIdNameParams {
    id: number;
  }

@Injectable()
export class UserService extends ApiBaseService {
  private static readonly GET_API_USER_PATH = '/api/User';
  private static readonly POST_API_USER_PATH = '/api/User';
  private static readonly GET_API_USER_ID_PATH = '/api/User/{id}';
  private static readonly PUT_API_USER_ID_PATH = '/api/User/{id}';
  private static readonly DELETE_API_USER_ID_PATH = '/api/User/{id}';
  private static readonly GET_API_USER_ID_NAME_PATH = '/api/User/{id}/name';

  public getApiUser(context?: HttpContext): AbortablePromise<GetApiUserApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_API_USER_PATH, 'get');

    return waitForResponse<GetApiUserApiResponse>(
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

  public postApiUser(params?: PostApiUserParams, context?: HttpContext): AbortablePromise<PostApiUserApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.POST_API_USER_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiUserApiResponse>(
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

  public getApiUserId(params: GetApiUserIdParams, context?: HttpContext): AbortablePromise<GetApiUserIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_API_USER_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiUserIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'json',
          403: 'text',
          404: 'json',
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
          400: 'json',
          401: 'json',
          403: 'text',
          404: 'json',
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
          401: 'json',
          403: 'text',
          404: 'json',
          500: 'text',
        }
      }
    )
  }

  public getApiUserIdName(params: GetApiUserIdNameParams, context?: HttpContext): AbortablePromise<GetApiUserIdNameApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_API_USER_ID_NAME_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiUserIdNameApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'json',
          403: 'text',
          404: 'json',
          500: 'text',
        }
      }
    )
  }
}
