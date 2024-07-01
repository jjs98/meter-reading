import { MeterDto } from '../models/meter-dto';
import { ProblemDetails } from '../models/problem-details';
import { EasyNetworkStubBase, StrictRouteResponseCallback, StubRequestInfo, getStubResponder } from '../utils/easy-network-stub.utils';

const getMeterResponder = getStubResponder<{
    200: (MeterDto)[];
    401: never;
    403: never;
    500: never;
  }>();

const postMeterResponder = getStubResponder<{
    201: never;
    401: never;
    403: never;
    500: never;
  }>();

const getMeterIdResponder = getStubResponder<{
    200: MeterDto;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const putMeterIdResponder = getStubResponder<{
    204: never;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteMeterIdResponder = getStubResponder<{
    204: never;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class MeterStubs extends EasyNetworkStubBase {
  private static readonly GET_METER_PATH = 'Meter' as const;
  private static readonly POST_METER_PATH = 'Meter' as const;
  private static readonly GET_METER_ID_PATH = 'Meter/{id:number}' as const;
  private static readonly PUT_METER_ID_PATH = 'Meter/{id:number}' as const;
  private static readonly DELETE_METER_ID_PATH = 'Meter/{id:number}' as const;

  private readonly _getMeterRequests: (StubRequestInfo<typeof MeterStubs.GET_METER_PATH, unknown>)[] = [];
  private readonly _postMeterRequests: (StubRequestInfo<typeof MeterStubs.POST_METER_PATH, MeterDto>)[] = [];
  private readonly _getMeterIdRequests: (StubRequestInfo<typeof MeterStubs.GET_METER_ID_PATH, unknown>)[] = [];
  private readonly _putMeterIdRequests: (StubRequestInfo<typeof MeterStubs.PUT_METER_ID_PATH, MeterDto>)[] = [];
  private readonly _deleteMeterIdRequests: (StubRequestInfo<typeof MeterStubs.DELETE_METER_ID_PATH, unknown>)[] = [];

  public get getMeterRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_METER_PATH, unknown>)[] {
    return this._getMeterRequests;
  }
  public get postMeterRequests(): readonly (StubRequestInfo<typeof MeterStubs.POST_METER_PATH, MeterDto>)[] {
    return this._postMeterRequests;
  }
  public get getMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.GET_METER_ID_PATH, unknown>)[] {
    return this._getMeterIdRequests;
  }
  public get putMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.PUT_METER_ID_PATH, MeterDto>)[] {
    return this._putMeterIdRequests;
  }
  public get deleteMeterIdRequests(): readonly (StubRequestInfo<typeof MeterStubs.DELETE_METER_ID_PATH, unknown>)[] {
    return this._deleteMeterIdRequests;
  }

  public stubGetMeter(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_METER_PATH,
      typeof getMeterResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_METER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getMeterRequests.push(request);
        }
        throw await response(getMeterResponder, request);
      }
    );
    return this;
  }

  public stubPostMeter(response: StrictRouteResponseCallback<
      MeterDto,
      typeof MeterStubs.POST_METER_PATH,
      typeof postMeterResponder
    >): this {
    this.stubWrapper.stub2<MeterDto>()(
      'POST',
      MeterStubs.POST_METER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postMeterRequests.push(request);
        }
        throw await response(postMeterResponder, request);
      }
    );
    return this;
  }

  public stubGetMeterId(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.GET_METER_ID_PATH,
      typeof getMeterIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      MeterStubs.GET_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getMeterIdRequests.push(request);
        }
        throw await response(getMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubPutMeterId(response: StrictRouteResponseCallback<
      MeterDto,
      typeof MeterStubs.PUT_METER_ID_PATH,
      typeof putMeterIdResponder
    >): this {
    this.stubWrapper.stub2<MeterDto>()(
      'PUT',
      MeterStubs.PUT_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putMeterIdRequests.push(request);
        }
        throw await response(putMeterIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteMeterId(response: StrictRouteResponseCallback<
      unknown,
      typeof MeterStubs.DELETE_METER_ID_PATH,
      typeof deleteMeterIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      MeterStubs.DELETE_METER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteMeterIdRequests.push(request);
        }
        throw await response(deleteMeterIdResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getMeterRequests.length = 0;
    this._postMeterRequests.length = 0;
    this._getMeterIdRequests.length = 0;
    this._putMeterIdRequests.length = 0;
    this._deleteMeterIdRequests.length = 0;
    super.reset();
  }
}
