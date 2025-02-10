import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { DeleteApiUserRoleIdApiResponse, GetApiUserRoleRoleRoleIdApiResponse, GetApiUserRoleUserUserIdApiResponse, PostApiUserRoleApiResponse, PutApiUserRoleIdApiResponse } from '../models/responses/user-role-responses.model';
import type { UserRole } from '../models/user-role';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation getApiUserRoleRoleRoleId
 */
type GetApiUserRoleRoleRoleIdParams = {
    roleId: number;
  };

/**
 * Parameters for operation getApiUserRoleUserUserId
 */
type GetApiUserRoleUserUserIdParams = {
    userId: number;
  };

/**
 * Parameters for operation postApiUserRole
 */
type PostApiUserRoleParams = {
    body?: UserRole;
  };

/**
 * Parameters for operation putApiUserRoleId
 */
type PutApiUserRoleIdParams = {
    id: number;
    body?: UserRole;
  };

/**
 * Parameters for operation deleteApiUserRoleId
 */
type DeleteApiUserRoleIdParams = {
    id: number;
  };

@Injectable()
export class UserRoleService extends ApiBaseService {
  private static readonly GET_API_USER_ROLE_ROLE_ROLE_ID_PATH = '/api/UserRole/role/{roleId}';
  private static readonly GET_API_USER_ROLE_USER_USER_ID_PATH = '/api/UserRole/user/{userId}';
  private static readonly POST_API_USER_ROLE_PATH = '/api/UserRole';
  private static readonly PUT_API_USER_ROLE_ID_PATH = '/api/UserRole/{id}';
  private static readonly DELETE_API_USER_ROLE_ID_PATH = '/api/UserRole/{id}';

  public getApiUserRoleRoleRoleId(params: GetApiUserRoleRoleRoleIdParams, context?: HttpContext): AbortablePromise<GetApiUserRoleRoleRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserRoleService.GET_API_USER_ROLE_ROLE_ROLE_ID_PATH, 'get');
    rb.path('roleId', params.roleId, {});

    return waitForResponse<GetApiUserRoleRoleRoleIdApiResponse>(
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

  public getApiUserRoleUserUserId(params: GetApiUserRoleUserUserIdParams, context?: HttpContext): AbortablePromise<GetApiUserRoleUserUserIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserRoleService.GET_API_USER_ROLE_USER_USER_ID_PATH, 'get');
    rb.path('userId', params.userId, {});

    return waitForResponse<GetApiUserRoleUserUserIdApiResponse>(
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

  public postApiUserRole(params?: PostApiUserRoleParams, context?: HttpContext): AbortablePromise<PostApiUserRoleApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserRoleService.POST_API_USER_ROLE_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiUserRoleApiResponse>(
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

  public putApiUserRoleId(params: PutApiUserRoleIdParams, context?: HttpContext): AbortablePromise<PutApiUserRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserRoleService.PUT_API_USER_ROLE_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutApiUserRoleIdApiResponse>(
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

  public deleteApiUserRoleId(params: DeleteApiUserRoleIdParams, context?: HttpContext): AbortablePromise<DeleteApiUserRoleIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserRoleService.DELETE_API_USER_ROLE_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteApiUserRoleIdApiResponse>(
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
}
