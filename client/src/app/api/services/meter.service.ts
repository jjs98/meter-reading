import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Meter } from '../models/meter';
import { DeleteApiMeterIdApiResponse, GetApiMeterApiResponse, GetApiMeterIdApiResponse, PostApiMeterApiResponse, PutApiMeterIdApiResponse } from '../models/responses/meter-responses.model';
import { AbortablePromise, waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

/**
 * Parameters for operation postApiMeter
 */
type PostApiMeterParams = {
    body?: Meter;
  };

/**
 * Parameters for operation getApiMeterId
 */
type GetApiMeterIdParams = {
    id: number;
  };

/**
 * Parameters for operation putApiMeterId
 */
type PutApiMeterIdParams = {
    id: number;
    body?: Meter;
  };

/**
 * Parameters for operation deleteApiMeterId
 */
type DeleteApiMeterIdParams = {
    id: number;
  };

@Injectable()
export class MeterService extends ApiBaseService {
  private static readonly GET_API_METER_PATH = '/api/Meter';
  private static readonly POST_API_METER_PATH = '/api/Meter';
  private static readonly GET_API_METER_ID_PATH = '/api/Meter/{id}';
  private static readonly PUT_API_METER_ID_PATH = '/api/Meter/{id}';
  private static readonly DELETE_API_METER_ID_PATH = '/api/Meter/{id}';

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
          401: 'text',
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
          401: 'text',
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
          401: 'text',
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
          401: 'text',
          403: 'text',
          404: 'json',
          500: 'text',
        }
      }
    )
  }
}
