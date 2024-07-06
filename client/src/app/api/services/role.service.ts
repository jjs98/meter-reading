import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DeleteApiRoleIdApiResponse, GetApiRoleApiResponse, GetApiRoleIdApiResponse, PostApiRoleApiResponse, PutApiRoleIdApiResponse } from '../models/responses/role-responses.model';
import { Role } from '../models/role';
import { AbortablePromise, waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

/**
 * Parameters for operation postApiRole
 */
type PostApiRoleParams = {
    body?: Role;
  };

/**
 * Parameters for operation getApiRoleId
 */
type GetApiRoleIdParams = {
    id: number;
  };

/**
 * Parameters for operation putApiRoleId
 */
type PutApiRoleIdParams = {
    id: number;
    body?: Role;
  };

/**
 * Parameters for operation deleteApiRoleId
 */
type DeleteApiRoleIdParams = {
    id: number;
  };

@Injectable()
export class RoleService extends ApiBaseService {
  private static readonly GET_API_ROLE_PATH = '/api/Role';
  private static readonly POST_API_ROLE_PATH = '/api/Role';
  private static readonly GET_API_ROLE_ID_PATH = '/api/Role/{id}';
  private static readonly PUT_API_ROLE_ID_PATH = '/api/Role/{id}';
  private static readonly DELETE_API_ROLE_ID_PATH = '/api/Role/{id}';

  public getApiRole(context?: HttpContext): AbortablePromise<GetApiRoleApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, RoleService.GET_API_ROLE_PATH, 'get');

    return waitForResponse<GetApiRoleApiResponse>(
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

  public postApiRole(params?: PostApiRoleParams, context?: HttpContext): AbortablePromise<PostApiRoleApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, RoleService.POST_API_ROLE_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiRoleApiResponse>(
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

  public getApiRoleId(params: GetApiRoleIdParams, context?: HttpContext): AbortablePromise<GetApiRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, RoleService.GET_API_ROLE_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiRoleIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'text',
          403: 'text',
          404: 'json',
          500: 'text',
        }
      }
    )
  }

  public putApiRoleId(params: PutApiRoleIdParams, context?: HttpContext): AbortablePromise<PutApiRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, RoleService.PUT_API_ROLE_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutApiRoleIdApiResponse>(
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
          404: 'json',
          500: 'text',
        }
      }
    )
  }

  public deleteApiRoleId(params: DeleteApiRoleIdParams, context?: HttpContext): AbortablePromise<DeleteApiRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, RoleService.DELETE_API_ROLE_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteApiRoleIdApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: '*/*',
        context,
      })),
      {
        errorResponseTypes: {
          401: 'text',
          403: 'text',
          404: 'json',
          500: 'text',
        }
      }
    )
  }
}
