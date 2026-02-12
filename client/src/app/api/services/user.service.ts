import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { GetUserNameEndpointApiResponse } from '../models/responses/user-responses.model';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation getUserNameEndpoint
 */
type GetUserNameEndpointParams = {
    id: number;
  };

@Injectable()
export class UserService extends ApiBaseService {
  private static readonly GET_USER_NAME_ENDPOINT_PATH = '/api/user/{id}/name';

  public getUserNameEndpoint(params: GetUserNameEndpointParams, context?: HttpContext): AbortablePromise<GetUserNameEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, UserService.GET_USER_NAME_ENDPOINT_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetUserNameEndpointApiResponse>(
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
