import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { waitForResponse } from '../utils/angular-service.utils';
import { ApiBaseService } from '../utils/api-base-service';
import { RequestBuilder } from '../utils/request-builder';

import type { CreateMeterEndpointRequest } from '../models/create-meter-endpoint-request';
import type { CreateMeterEndpointApiResponse, DeleteMeterEndpointApiResponse, GetMetersEndpointApiResponse, GetSharedByMeterIdEndpointApiResponse, GetSharedMetersEndpointApiResponse, RevokeMeterEndpointApiResponse, ShareMeterEndpointApiResponse, UpdateMeterEndpointApiResponse } from '../models/responses/meter-responses.model';
import type { RevokeMeterEndpointRequest } from '../models/revoke-meter-endpoint-request';
import type { ShareMeterEndpointRequest } from '../models/share-meter-endpoint-request';
import type { UpdateMeterEndpointRequest } from '../models/update-meter-endpoint-request';
import type { AbortablePromise } from '../utils/angular-service.utils';

/**
 * Parameters for operation createMeterEndpoint
 */
type CreateMeterEndpointParams = {
    body: CreateMeterEndpointRequest;
  };

/**
 * Parameters for operation updateMeterEndpoint
 */
type UpdateMeterEndpointParams = {
    id: number;
    body: UpdateMeterEndpointRequest;
  };

/**
 * Parameters for operation deleteMeterEndpoint
 */
type DeleteMeterEndpointParams = {
    id: number;
  };

/**
 * Parameters for operation getSharedByMeterIdEndpoint
 */
type GetSharedByMeterIdEndpointParams = {
    meterId: number;
  };

/**
 * Parameters for operation revokeMeterEndpoint
 */
type RevokeMeterEndpointParams = {
    body: RevokeMeterEndpointRequest;
  };

/**
 * Parameters for operation shareMeterEndpoint
 */
type ShareMeterEndpointParams = {
    body: ShareMeterEndpointRequest;
  };

@Injectable()
export class MeterService extends ApiBaseService {
  private static readonly GET_METERS_ENDPOINT_PATH = '/api/meter';
  private static readonly CREATE_METER_ENDPOINT_PATH = '/api/meter';
  private static readonly UPDATE_METER_ENDPOINT_PATH = '/api/meter/{id}';
  private static readonly DELETE_METER_ENDPOINT_PATH = '/api/meter/{id}';
  private static readonly GET_SHARED_BY_METER_ID_ENDPOINT_PATH = '/api/meter/shared/{meterId}';
  private static readonly GET_SHARED_METERS_ENDPOINT_PATH = '/api/meter/shared';
  private static readonly REVOKE_METER_ENDPOINT_PATH = '/api/meter/revoke';
  private static readonly SHARE_METER_ENDPOINT_PATH = '/api/meter/share';

  public getMetersEndpoint(context?: HttpContext): AbortablePromise<GetMetersEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_METERS_ENDPOINT_PATH, 'get');

    return waitForResponse<GetMetersEndpointApiResponse>(
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

  public createMeterEndpoint(params: CreateMeterEndpointParams, context?: HttpContext): AbortablePromise<CreateMeterEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.CREATE_METER_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<CreateMeterEndpointApiResponse>(
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

  public updateMeterEndpoint(params: UpdateMeterEndpointParams, context?: HttpContext): AbortablePromise<UpdateMeterEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.UPDATE_METER_ENDPOINT_PATH, 'put');
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');

    return waitForResponse<UpdateMeterEndpointApiResponse>(
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

  public deleteMeterEndpoint(params: DeleteMeterEndpointParams, context?: HttpContext): AbortablePromise<DeleteMeterEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.DELETE_METER_ENDPOINT_PATH, 'delete');
    rb.path('id', params.id, {});

    return waitForResponse<DeleteMeterEndpointApiResponse>(
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

  public getSharedByMeterIdEndpoint(params: GetSharedByMeterIdEndpointParams, context?: HttpContext): AbortablePromise<GetSharedByMeterIdEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_SHARED_BY_METER_ID_ENDPOINT_PATH, 'get');
    rb.path('meterId', params.meterId, {});

    return waitForResponse<GetSharedByMeterIdEndpointApiResponse>(
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

  public getSharedMetersEndpoint(context?: HttpContext): AbortablePromise<GetSharedMetersEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.GET_SHARED_METERS_ENDPOINT_PATH, 'get');

    return waitForResponse<GetSharedMetersEndpointApiResponse>(
      this.http.request(rb.build({
        responseType: 'json',
        accept: 'application/json',
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

  public revokeMeterEndpoint(params: RevokeMeterEndpointParams, context?: HttpContext): AbortablePromise<RevokeMeterEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.REVOKE_METER_ENDPOINT_PATH, 'delete');
    rb.body(params.body, '*/*');

    return waitForResponse<RevokeMeterEndpointApiResponse>(
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

  public shareMeterEndpoint(params: ShareMeterEndpointParams, context?: HttpContext): AbortablePromise<ShareMeterEndpointApiResponse> {
    const rb = new RequestBuilder(this.rootUrl, MeterService.SHARE_METER_ENDPOINT_PATH, 'post');
    rb.body(params.body, 'application/json');

    return waitForResponse<ShareMeterEndpointApiResponse>(
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
}
