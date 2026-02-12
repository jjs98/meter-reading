import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { CreateReadingEndpointRequest } from '../models/create-reading-endpoint-request';
import type { CreateReadingEndpointApiResponse, DeleteReadingEndpointApiResponse, GetReadingsEndpointApiResponse, UpdateReadingEndpointApiResponse } from '../models/responses/reading-responses.model';
import type { UpdateReadingEndpointRequest } from '../models/update-reading-endpoint-request';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation getReadingsEndpoint
 */
type GetReadingsEndpointParams = {
    meterId: number;
  };

/**
 * Parameters for operation createReadingEndpoint
 */
type CreateReadingEndpointParams = {
    body: CreateReadingEndpointRequest;
  };

/**
 * Parameters for operation updateReadingEndpoint
 */
type UpdateReadingEndpointParams = {
    id: number;
    body: UpdateReadingEndpointRequest;
  };

/**
 * Parameters for operation deleteReadingEndpoint
 */
type DeleteReadingEndpointParams = {
    id: number;
  };

@Injectable()
export class ReadingService extends ApiBaseService {
  private static readonly GET_READINGS_ENDPOINT_PATH = '/api/reading';
  private static readonly CREATE_READING_ENDPOINT_PATH = '/api/reading';
  private static readonly UPDATE_READING_ENDPOINT_PATH = '/api/reading/{id}';
  private static readonly DELETE_READING_ENDPOINT_PATH = '/api/reading/{id}';

  public getReadingsEndpoint(params: GetReadingsEndpointParams, context?: HttpContext): AbortablePromise<GetReadingsEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.GET_READINGS_ENDPOINT_PATH, 'get');
    rb.query('meterId', params.meterId, {});

    return waitForResponse<GetReadingsEndpointApiResponse>(
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
          404: 'text',
          500: 'text',
        }
      }
    )
  }

  public createReadingEndpoint(params: CreateReadingEndpointParams, context?: HttpContext): AbortablePromise<CreateReadingEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.CREATE_READING_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<CreateReadingEndpointApiResponse>(
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

  public updateReadingEndpoint(params: UpdateReadingEndpointParams, context?: HttpContext): AbortablePromise<UpdateReadingEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.UPDATE_READING_ENDPOINT_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<UpdateReadingEndpointApiResponse>(
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
          404: 'text',
          500: 'text',
        }
      }
    )
  }

  public deleteReadingEndpoint(params: DeleteReadingEndpointParams, context?: HttpContext): AbortablePromise<DeleteReadingEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, ReadingService.DELETE_READING_ENDPOINT_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteReadingEndpointApiResponse>(
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
          404: 'text',
          500: 'text',
        }
      }
    )
  }
}
