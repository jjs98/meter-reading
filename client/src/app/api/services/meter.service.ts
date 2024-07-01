import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MeterDto } from '../models/meter-dto';
import { DeleteMeterIdApiResponse, GetMeterApiResponse, GetMeterIdApiResponse, PostMeterApiResponse, PutMeterIdApiResponse } from '../models/responses/meter-responses.model';
import { AbortablePromise, waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

/**
 * Parameters for operation postMeter
 */
type PostMeterParams = {
    body?: MeterDto;
  };

/**
 * Parameters for operation getMeterId
 */
type GetMeterIdParams = {
    id: number;
  };

/**
 * Parameters for operation putMeterId
 */
type PutMeterIdParams = {
    id: number;
    body?: MeterDto;
  };

/**
 * Parameters for operation deleteMeterId
 */
type DeleteMeterIdParams = {
    id: number;
  };

@Injectable()
export class MeterService extends ApiBaseService {
  private static readonly GET_METER_PATH = '/Meter';
  private static readonly POST_METER_PATH = '/Meter';
  private static readonly GET_METER_ID_PATH = '/Meter/{id}';
  private static readonly PUT_METER_ID_PATH = '/Meter/{id}';
  private static readonly DELETE_METER_ID_PATH = '/Meter/{id}';

  public getMeter(context?: HttpContext): AbortablePromise<GetMeterApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_METER_PATH, 'get');

    return waitForResponse<GetMeterApiResponse>(
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

  public postMeter(params?: PostMeterParams, context?: HttpContext): AbortablePromise<PostMeterApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.POST_METER_PATH, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return waitForResponse<PostMeterApiResponse>(
      this.http.request(rb.build({
        responseType: 'text',
        accept: '*/*',
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

  public getMeterId(params: GetMeterIdParams, context?: HttpContext): AbortablePromise<GetMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_METER_ID_PATH, 'get');
    rb.path('id', params.id, {});

    return waitForResponse<GetMeterIdApiResponse>(
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

  public putMeterId(params: PutMeterIdParams, context?: HttpContext): AbortablePromise<PutMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.PUT_METER_ID_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<PutMeterIdApiResponse>(
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

  public deleteMeterId(params: DeleteMeterIdParams, context?: HttpContext): AbortablePromise<DeleteMeterIdApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.DELETE_METER_ID_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteMeterIdApiResponse>(
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
