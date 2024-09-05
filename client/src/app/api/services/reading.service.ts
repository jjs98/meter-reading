import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { Reading } from '../models/reading';
import type { DeleteApiReadingIdApiResponse, GetApiReadingApiResponse, GetApiReadingIdApiResponse, PostApiReadingApiResponse, PutApiReadingIdApiResponse } from '../models/responses/reading-responses.model';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation getApiReading
 */
type GetApiReadingParams = {
    meterId?: number;
  };

/**
 * Parameters for operation postApiReading
 */
type PostApiReadingParams = {
    body?: Reading;
  };

/**
 * Parameters for operation getApiReadingId
 */
type GetApiReadingIdParams = {
    id: number;
  };

/**
 * Parameters for operation putApiReadingId
 */
type PutApiReadingIdParams = {
    id: number;
    body?: Reading;
  };

/**
 * Parameters for operation deleteApiReadingId
 */
type DeleteApiReadingIdParams = {
    id: number;
  };

@Injectable()
export class ReadingService extends ApiBaseService {
  private static readonly GET_API_READING_PATH = '/api/Reading';
  private static readonly POST_API_READING_PATH = '/api/Reading';
  private static readonly GET_API_READING_ID_PATH = '/api/Reading/{id}';
  private static readonly PUT_API_READING_ID_PATH = '/api/Reading/{id}';
  private static readonly DELETE_API_READING_ID_PATH = '/api/Reading/{id}';

  public getApiReading(params?: GetApiReadingParams, context?: HttpContext): AbortablePromise<GetApiReadingApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.GET_API_READING_PATH, 'get');
    if (params) {
      rb.query('meterId', params.meterId, {});
    }

    return waitForResponse<GetApiReadingApiResponse>(
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

  public postApiReading(params?: PostApiReadingParams, context?: HttpContext): AbortablePromise<PostApiReadingApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.POST_API_READING_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiReadingApiResponse>(
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

  public getApiReadingId(params: GetApiReadingIdParams, context?: HttpContext): AbortablePromise<GetApiReadingIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.GET_API_READING_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiReadingIdApiResponse>(
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

  public putApiReadingId(params: PutApiReadingIdParams, context?: HttpContext): AbortablePromise<PutApiReadingIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.PUT_API_READING_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutApiReadingIdApiResponse>(
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

  public deleteApiReadingId(params: DeleteApiReadingIdParams, context?: HttpContext): AbortablePromise<DeleteApiReadingIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.DELETE_API_READING_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteApiReadingIdApiResponse>(
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
