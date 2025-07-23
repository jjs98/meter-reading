import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { Meter } from '../models/meter';
import type { MeterShareDto } from '../models/meter-share-dto';
import type { DeleteApiMeterIdApiResponse, DeleteApiMeterRevokeApiResponse, GetApiMeterApiResponse, GetApiMeterIdApiResponse, GetApiMeterSharedApiResponse, GetApiMeterSharedMeterIdApiResponse, PostApiMeterApiResponse, PostApiMeterShareApiResponse, PutApiMeterIdApiResponse } from '../models/responses/meter-responses.model';
import type { RevokeMeterShareDto } from '../models/revoke-meter-share-dto';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation postApiMeter
 */
interface PostApiMeterParams {
    body?: Meter;
  }

/**
 * Parameters for operation getApiMeterId
 */
interface GetApiMeterIdParams {
    id: number;
  }

/**
 * Parameters for operation putApiMeterId
 */
interface PutApiMeterIdParams {
    id: number;
    body?: Meter;
  }

/**
 * Parameters for operation deleteApiMeterId
 */
interface DeleteApiMeterIdParams {
    id: number;
  }

/**
 * Parameters for operation getApiMeterSharedMeterId
 */
interface GetApiMeterSharedMeterIdParams {
    meterId: number;
  }

/**
 * Parameters for operation postApiMeterShare
 */
interface PostApiMeterShareParams {
    body?: MeterShareDto;
  }

/**
 * Parameters for operation deleteApiMeterRevoke
 */
interface DeleteApiMeterRevokeParams {
    body?: RevokeMeterShareDto;
  }

@Injectable()
export class MeterService extends ApiBaseService {
  private static readonly GET_API_METER_PATH = '/api/Meter';
  private static readonly POST_API_METER_PATH = '/api/Meter';
  private static readonly GET_API_METER_ID_PATH = '/api/Meter/{id}';
  private static readonly PUT_API_METER_ID_PATH = '/api/Meter/{id}';
  private static readonly DELETE_API_METER_ID_PATH = '/api/Meter/{id}';
  private static readonly GET_API_METER_SHARED_PATH = '/api/Meter/shared';
  private static readonly GET_API_METER_SHARED_METER_ID_PATH = '/api/Meter/shared/{meterId}';
  private static readonly POST_API_METER_SHARE_PATH = '/api/Meter/share';
  private static readonly DELETE_API_METER_REVOKE_PATH = '/api/Meter/revoke';

  public getApiMeter(context?: HttpContext): AbortablePromise<GetApiMeterApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_API_METER_PATH, 'get');

    return waitForResponse<GetApiMeterApiResponse>(
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

  public postApiMeter(params?: PostApiMeterParams, context?: HttpContext): AbortablePromise<PostApiMeterApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.POST_API_METER_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiMeterApiResponse>(
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

  public getApiMeterId(params: GetApiMeterIdParams, context?: HttpContext): AbortablePromise<GetApiMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_API_METER_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetApiMeterIdApiResponse>(
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

  public putApiMeterId(params: PutApiMeterIdParams, context?: HttpContext): AbortablePromise<PutApiMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.PUT_API_METER_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutApiMeterIdApiResponse>(
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

  public deleteApiMeterId(params: DeleteApiMeterIdParams, context?: HttpContext): AbortablePromise<DeleteApiMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.DELETE_API_METER_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteApiMeterIdApiResponse>(
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

  public getApiMeterShared(context?: HttpContext): AbortablePromise<GetApiMeterSharedApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_API_METER_SHARED_PATH, 'get');

    return waitForResponse<GetApiMeterSharedApiResponse>(
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

  public getApiMeterSharedMeterId(params: GetApiMeterSharedMeterIdParams, context?: HttpContext): AbortablePromise<GetApiMeterSharedMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_API_METER_SHARED_METER_ID_PATH, 'get');
    rb.path('meterId', params.meterId, {});

    return waitForResponse<GetApiMeterSharedMeterIdApiResponse>(
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

  public postApiMeterShare(params?: PostApiMeterShareParams, context?: HttpContext): AbortablePromise<PostApiMeterShareApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.POST_API_METER_SHARE_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostApiMeterShareApiResponse>(
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

  public deleteApiMeterRevoke(params?: DeleteApiMeterRevokeParams, context?: HttpContext): AbortablePromise<DeleteApiMeterRevokeApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.DELETE_API_METER_REVOKE_PATH, 'delete');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<DeleteApiMeterRevokeApiResponse>(
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
