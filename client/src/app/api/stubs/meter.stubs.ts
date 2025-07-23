import { EasyNetworkStubBase, getStubResponder } from '../utils/easy-network-stub.utils';

import type { Meter } from '../models/meter';
import type { MeterShareDto } from '../models/meter-share-dto';
import type { ProblemDetails } from '../models/problem-details';
import type { RevokeMeterShareDto } from '../models/revoke-meter-share-dto';
import type { SharedMeter } from '../models/shared-meter';
import type { StrictRouteResponseCallback, StubRequestInfo } from '../utils/easy-network-stub.utils';

const getApiMeterResponder = getStubResponder<{
    200: (Meter)[];
    401: never;
    403: never;
    500: never;
  }>();

const postApiMeterResponder = getStubResponder<{
    201: Meter;
    401: ProblemDetails;
    403: never;
    500: never;
  }>();

const getApiMeterIdResponder = getStubResponder<{
    200: Meter;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const putApiMeterIdResponder = getStubResponder<{
    204: never;
    400: ProblemDetails;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiMeterIdResponder = getStubResponder<{
    204: never;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const getApiMeterSharedResponder = getStubResponder<{
    200: (Meter)[];
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const getApiMeterSharedMeterIdResponder = getStubResponder<{
    200: (MeterShareDto)[];
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const postApiMeterShareResponder = getStubResponder<{
    201: SharedMeter;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiMeterRevokeResponder = getStubResponder<{
    204: never;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class MeterStubs extends EasyNetworkStubBase {
  private static readonly GET_API_METER_PATH = 'api/Meter' as const;
  private static readonly POST_API_METER_PATH = 'api/Meter' as const;
  private static readonly GET_API_METER_ID_PATH = 'api/Meter/{id:number}' as const;
  private static readonly PUT_API_METER_ID_PATH = 'api/Meter/{id:number}' as const;
  private static readonly DELETE_API_METER_ID_PATH = 'api/Meter/{id:number}' as const;
  private static readonly GET_API_METER_SHARED_PATH = 'api/Meter/shared' as const;
  private static readonly GET_API_METER_SHARED_METER_ID_PATH = 'api/Meter/shared/{meterId:number}' as const;
  private static readonly POST_API_METER_SHARE_PATH = 'api/Meter/share' as const;
  private static readonly DELETE_API_METER_REVOKE_PATH = 'api/Meter/revoke' as const;

  private readonly _getApiMeterRequests: (StubRequestInfo<typeof MeterStubs.GET_API_METER_PATH, unknown>)[] = [];
  private readonly _postApiMeterRequests: (StubRequestInfo<typeof MeterStubs.POST_API_METER_PATH, Meter>)[] = [];
  private readonly _getApiMeterIdRequests: (StubRequestInfo<typeof MeterStubs.GET_API_METER_ID_PATH, unknown>)[] = [];
  private readonly _putApiMeterIdRequests: (StubRequestInfo<typeof MeterStubs.PUT_API_METER_ID_PATH, Meter>)[] = [];
  private readonly _deleteApiMeterIdRequests: (StubRequestInfo<typeof MeterStubs.DELETE_API_METER_ID_PATH, unknown>)[] = [];
  private readonly _getApiMeterSharedRequests: (StubRequestInfo<typeof MeterStubs.GET_API_METER_SHARED_PATH, unknown>)[] = [];
  private readonly _getApiMeterSharedMeterIdRequests: (StubRequestInfo<typeof MeterStubs.GET_API_METER_SHARED_METER_ID_PATH, unknown>)[] = [];
  private readonly _postApiMeterShareRequests: (StubRequestInfo<typeof MeterStubs.POST_API_METER_SHARE_PATH, MeterShareDto>)[] = [];
  private readonly _deleteApiMeterRevokeRequests: (StubRequestInfo<typeof MeterStubs.DELETE_API_METER_REVOKE_PATH, RevokeMeterShareDto>)[] = [];

  public get getApiMeterRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_API_METER_PATH, unknown>)[] {
    return this._getApiMeterRequests;
  }
  public get postApiMeterRequests(): readonly (StubRequestInfo<typeof MeterStubs.POST_API_METER_PATH, Meter>)[] {
    return this._postApiMeterRequests;
  }
  public get getApiMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_API_METER_ID_PATH, unknown>)[] {
    return this._getApiMeterIdRequests;
  }
  public get putApiMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.PUT_API_METER_ID_PATH, Meter>)[] {
    return this._putApiMeterIdRequests;
  }
  public get deleteApiMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.DELETE_API_METER_ID_PATH, unknown>)[] {
    return this._deleteApiMeterIdRequests;
  }
  public get getApiMeterSharedRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_API_METER_SHARED_PATH, unknown>)[] {
    return this._getApiMeterSharedRequests;
  }
  public get getApiMeterSharedMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_API_METER_SHARED_METER_ID_PATH, unknown>)[] {
    return this._getApiMeterSharedMeterIdRequests;
  }
  public get postApiMeterShareRequests(): readonly (StubRequestInfo<typeof MeterStubs.POST_API_METER_SHARE_PATH, MeterShareDto>)[] {
    return this._postApiMeterShareRequests;
  }
  public get deleteApiMeterRevokeRequests(): readonly (StubRequestInfo<typeof MeterStubs.DELETE_API_METER_REVOKE_PATH, RevokeMeterShareDto>)[] {
    return this._deleteApiMeterRevokeRequests;
  }

  public stubGetApiMeter(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_API_METER_PATH,
      typeof getApiMeterResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_API_METER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiMeterRequests.push(request);
        }
        throw await response(getApiMeterResponder, request);
      }
    );
    return this;
  }

  public stubPostApiMeter(response: StrictRouteResponseCallback<
      Meter,
      typeof MeterStubs.POST_API_METER_PATH,
      typeof postApiMeterResponder
    >): this {
    this.stubWrapper.stub2<Meter>()(
      'POST',
      MeterStubs.POST_API_METER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiMeterRequests.push(request);
        }
        throw await response(postApiMeterResponder, request);
      }
    );
    return this;
  }

  public stubGetApiMeterId(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_API_METER_ID_PATH,
      typeof getApiMeterIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_API_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiMeterIdRequests.push(request);
        }
        throw await response(getApiMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubPutApiMeterId(response: StrictRouteResponseCallback<
      Meter,
      typeof MeterStubs.PUT_API_METER_ID_PATH,
      typeof putApiMeterIdResponder
    >): this {
    this.stubWrapper.stub2<Meter>()(
      'PUT',
      MeterStubs.PUT_API_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putApiMeterIdRequests.push(request);
        }
        throw await response(putApiMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiMeterId(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.DELETE_API_METER_ID_PATH,
      typeof deleteApiMeterIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      MeterStubs.DELETE_API_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiMeterIdRequests.push(request);
        }
        throw await response(deleteApiMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubGetApiMeterShared(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_API_METER_SHARED_PATH,
      typeof getApiMeterSharedResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_API_METER_SHARED_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiMeterSharedRequests.push(request);
        }
        throw await response(getApiMeterSharedResponder, request);
      }
    );
    return this;
  }

  public stubGetApiMeterSharedMeterId(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_API_METER_SHARED_METER_ID_PATH,
      typeof getApiMeterSharedMeterIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_API_METER_SHARED_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiMeterSharedMeterIdRequests.push(request);
        }
        throw await response(getApiMeterSharedMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubPostApiMeterShare(response: StrictRouteResponseCallback<
      MeterShareDto,
      typeof MeterStubs.POST_API_METER_SHARE_PATH,
      typeof postApiMeterShareResponder
    >): this {
    this.stubWrapper.stub2<MeterShareDto>()(
      'POST',
      MeterStubs.POST_API_METER_SHARE_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiMeterShareRequests.push(request);
        }
        throw await response(postApiMeterShareResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiMeterRevoke(response: StrictRouteResponseCallback<
      RevokeMeterShareDto,
      typeof MeterStubs.DELETE_API_METER_REVOKE_PATH,
      typeof deleteApiMeterRevokeResponder
    >): this {
    this.stubWrapper.stub2<RevokeMeterShareDto>()(
      'DELETE',
      MeterStubs.DELETE_API_METER_REVOKE_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiMeterRevokeRequests.push(request);
        }
        throw await response(deleteApiMeterRevokeResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getApiMeterRequests.length = 0;
    this._postApiMeterRequests.length = 0;
    this._getApiMeterIdRequests.length = 0;
    this._putApiMeterIdRequests.length = 0;
    this._deleteApiMeterIdRequests.length = 0;
    this._getApiMeterSharedRequests.length = 0;
    this._getApiMeterSharedMeterIdRequests.length = 0;
    this._postApiMeterShareRequests.length = 0;
    this._deleteApiMeterRevokeRequests.length = 0;
    super.reset();
  }
}
