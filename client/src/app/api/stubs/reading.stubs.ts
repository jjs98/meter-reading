import { EasyNetworkStubBase, getStubResponder } from '../utils/easy-network-stub.utils';

import type { ProblemDetails } from '../models/problem-details';
import type { Reading } from '../models/reading';
import type { StrictRouteResponseCallback, StubRequestInfo } from '../utils/easy-network-stub.utils';

const getApiReadingResponder = getStubResponder<{
    200: (Reading)[];
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const postApiReadingResponder = getStubResponder<{
    201: Reading;
    400: ProblemDetails;
    401: never;
    403: never;
    500: never;
  }>();

const getApiReadingIdResponder = getStubResponder<{
    200: Reading;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const putApiReadingIdResponder = getStubResponder<{
    204: never;
    400: ProblemDetails;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiReadingIdResponder = getStubResponder<{
    204: never;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class ReadingStubs extends EasyNetworkStubBase {
  private static readonly GET_API_READING_PATH = 'api/Reading?{meterId?:number}' as const;
  private static readonly POST_API_READING_PATH = 'api/Reading' as const;
  private static readonly GET_API_READING_ID_PATH = 'api/Reading/{id:number}' as const;
  private static readonly PUT_API_READING_ID_PATH = 'api/Reading/{id:number}' as const;
  private static readonly DELETE_API_READING_ID_PATH = 'api/Reading/{id:number}' as const;

  private readonly _getApiReadingRequests: (StubRequestInfo<typeof ReadingStubs.GET_API_READING_PATH, unknown>)[] = [];
  private readonly _postApiReadingRequests: (StubRequestInfo<typeof ReadingStubs.POST_API_READING_PATH, Reading>)[] = [];
  private readonly _getApiReadingIdRequests: (StubRequestInfo<typeof ReadingStubs.GET_API_READING_ID_PATH, unknown>)[] = [];
  private readonly _putApiReadingIdRequests: (StubRequestInfo<typeof ReadingStubs.PUT_API_READING_ID_PATH, Reading>)[] = [];
  private readonly _deleteApiReadingIdRequests: (StubRequestInfo<typeof ReadingStubs.DELETE_API_READING_ID_PATH, unknown>)[] = [];

  public get getApiReadingRequests(): readonly (StubRequestInfo<typeof ReadingStubs.GET_API_READING_PATH, unknown>)[] {
    return this._getApiReadingRequests;
  }
  public get postApiReadingRequests(): readonly (StubRequestInfo<typeof ReadingStubs.POST_API_READING_PATH, Reading>)[] {
    return this._postApiReadingRequests;
  }
  public get getApiReadingIdRequests(): readonly (StubRequestInfo<typeof ReadingStubs.GET_API_READING_ID_PATH, unknown>)[] {
    return this._getApiReadingIdRequests;
  }
  public get putApiReadingIdRequests(): readonly (StubRequestInfo<typeof ReadingStubs.PUT_API_READING_ID_PATH, Reading>)[] {
    return this._putApiReadingIdRequests;
  }
  public get deleteApiReadingIdRequests(): readonly (StubRequestInfo<typeof ReadingStubs.DELETE_API_READING_ID_PATH, unknown>)[] {
    return this._deleteApiReadingIdRequests;
  }

  public stubGetApiReading(response: StrictRouteResponseCallback<
      unknown,
      typeof ReadingStubs.GET_API_READING_PATH,
      typeof getApiReadingResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      ReadingStubs.GET_API_READING_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiReadingRequests.push(request);
        }
        throw await response(getApiReadingResponder, request);
      }
    );
    return this;
  }

  public stubPostApiReading(response: StrictRouteResponseCallback<
      Reading,
      typeof ReadingStubs.POST_API_READING_PATH,
      typeof postApiReadingResponder
    >): this {
    this.stubWrapper.stub2<Reading>()(
      'POST',
      ReadingStubs.POST_API_READING_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiReadingRequests.push(request);
        }
        throw await response(postApiReadingResponder, request);
      }
    );
    return this;
  }

  public stubGetApiReadingId(response: StrictRouteResponseCallback<
      unknown,
      typeof ReadingStubs.GET_API_READING_ID_PATH,
      typeof getApiReadingIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      ReadingStubs.GET_API_READING_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiReadingIdRequests.push(request);
        }
        throw await response(getApiReadingIdResponder, request);
      }
    );
    return this;
  }

  public stubPutApiReadingId(response: StrictRouteResponseCallback<
      Reading,
      typeof ReadingStubs.PUT_API_READING_ID_PATH,
      typeof putApiReadingIdResponder
    >): this {
    this.stubWrapper.stub2<Reading>()(
      'PUT',
      ReadingStubs.PUT_API_READING_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putApiReadingIdRequests.push(request);
        }
        throw await response(putApiReadingIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiReadingId(response: StrictRouteResponseCallback<
      unknown,
      typeof ReadingStubs.DELETE_API_READING_ID_PATH,
      typeof deleteApiReadingIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      ReadingStubs.DELETE_API_READING_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiReadingIdRequests.push(request);
        }
        throw await response(deleteApiReadingIdResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getApiReadingRequests.length = 0;
    this._postApiReadingRequests.length = 0;
    this._getApiReadingIdRequests.length = 0;
    this._putApiReadingIdRequests.length = 0;
    this._deleteApiReadingIdRequests.length = 0;
    super.reset();
  }
}
