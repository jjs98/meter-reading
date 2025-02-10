import { EasyNetworkStubBase, getStubResponder } from '../utils/easy-network-stub.utils';

import type { ProblemDetails } from '../models/problem-details';
import type { User } from '../models/user';
import type { StrictRouteResponseCallback, StubRequestInfo } from '../utils/easy-network-stub.utils';

const getApiUserResponder = getStubResponder<{
    200: (User)[];
    401: ProblemDetails;
    403: never;
    500: never;
  }>();

const postApiUserResponder = getStubResponder<{
    201: User;
    401: ProblemDetails;
    403: never;
    500: never;
  }>();

const getApiUserIdResponder = getStubResponder<{
    200: User;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const putApiUserIdResponder = getStubResponder<{
    204: never;
    400: ProblemDetails;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiUserIdResponder = getStubResponder<{
    204: never;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const getApiUserIdNameResponder = getStubResponder<{
    200: string;
    401: ProblemDetails;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class UserStubs extends EasyNetworkStubBase {
  private static readonly GET_API_USER_PATH = 'api/User' as const;
  private static readonly POST_API_USER_PATH = 'api/User' as const;
  private static readonly GET_API_USER_ID_PATH = 'api/User/{id:number}' as const;
  private static readonly PUT_API_USER_ID_PATH = 'api/User/{id:number}' as const;
  private static readonly DELETE_API_USER_ID_PATH = 'api/User/{id:number}' as const;
  private static readonly GET_API_USER_ID_NAME_PATH = 'api/User/{id:number}/name' as const;

  private readonly _getApiUserRequests: (StubRequestInfo<typeof UserStubs.GET_API_USER_PATH, unknown>)[] = [];
  private readonly _postApiUserRequests: (StubRequestInfo<typeof UserStubs.POST_API_USER_PATH, User>)[] = [];
  private readonly _getApiUserIdRequests: (StubRequestInfo<typeof UserStubs.GET_API_USER_ID_PATH, unknown>)[] = [];
  private readonly _putApiUserIdRequests: (StubRequestInfo<typeof UserStubs.PUT_API_USER_ID_PATH, User>)[] = [];
  private readonly _deleteApiUserIdRequests: (StubRequestInfo<typeof UserStubs.DELETE_API_USER_ID_PATH, unknown>)[] = [];
  private readonly _getApiUserIdNameRequests: (StubRequestInfo<typeof UserStubs.GET_API_USER_ID_NAME_PATH, unknown>)[] = [];

  public get getApiUserRequests(): readonly (StubRequestInfo<typeof UserStubs.GET_API_USER_PATH, unknown>)[] {
    return this._getApiUserRequests;
  }
  public get postApiUserRequests(): readonly (StubRequestInfo<typeof UserStubs.POST_API_USER_PATH, User>)[] {
    return this._postApiUserRequests;
  }
  public get getApiUserIdRequests(): readonly (StubRequestInfo<typeof UserStubs.GET_API_USER_ID_PATH, unknown>)[] {
    return this._getApiUserIdRequests;
  }
  public get putApiUserIdRequests(): readonly (StubRequestInfo<typeof UserStubs.PUT_API_USER_ID_PATH, User>)[] {
    return this._putApiUserIdRequests;
  }
  public get deleteApiUserIdRequests(): readonly (StubRequestInfo<typeof UserStubs.DELETE_API_USER_ID_PATH, unknown>)[] {
    return this._deleteApiUserIdRequests;
  }
  public get getApiUserIdNameRequests(): readonly (StubRequestInfo<typeof UserStubs.GET_API_USER_ID_NAME_PATH, unknown>)[] {
    return this._getApiUserIdNameRequests;
  }

  public stubGetApiUser(response: StrictRouteResponseCallback<
      unknown,
      typeof UserStubs.GET_API_USER_PATH,
      typeof getApiUserResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      UserStubs.GET_API_USER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiUserRequests.push(request);
        }
        throw await response(getApiUserResponder, request);
      }
    );
    return this;
  }

  public stubPostApiUser(response: StrictRouteResponseCallback<
      User,
      typeof UserStubs.POST_API_USER_PATH,
      typeof postApiUserResponder
    >): this {
    this.stubWrapper.stub2<User>()(
      'POST',
      UserStubs.POST_API_USER_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiUserRequests.push(request);
        }
        throw await response(postApiUserResponder, request);
      }
    );
    return this;
  }

  public stubGetApiUserId(response: StrictRouteResponseCallback<
      unknown,
      typeof UserStubs.GET_API_USER_ID_PATH,
      typeof getApiUserIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      UserStubs.GET_API_USER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiUserIdRequests.push(request);
        }
        throw await response(getApiUserIdResponder, request);
      }
    );
    return this;
  }

  public stubPutApiUserId(response: StrictRouteResponseCallback<
      User,
      typeof UserStubs.PUT_API_USER_ID_PATH,
      typeof putApiUserIdResponder
    >): this {
    this.stubWrapper.stub2<User>()(
      'PUT',
      UserStubs.PUT_API_USER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putApiUserIdRequests.push(request);
        }
        throw await response(putApiUserIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiUserId(response: StrictRouteResponseCallback<
      unknown,
      typeof UserStubs.DELETE_API_USER_ID_PATH,
      typeof deleteApiUserIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      UserStubs.DELETE_API_USER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiUserIdRequests.push(request);
        }
        throw await response(deleteApiUserIdResponder, request);
      }
    );
    return this;
  }

  public stubGetApiUserIdName(response: StrictRouteResponseCallback<
      unknown,
      typeof UserStubs.GET_API_USER_ID_NAME_PATH,
      typeof getApiUserIdNameResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      UserStubs.GET_API_USER_ID_NAME_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiUserIdNameRequests.push(request);
        }
        throw await response(getApiUserIdNameResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getApiUserRequests.length = 0;
    this._postApiUserRequests.length = 0;
    this._getApiUserIdRequests.length = 0;
    this._putApiUserIdRequests.length = 0;
    this._deleteApiUserIdRequests.length = 0;
    this._getApiUserIdNameRequests.length = 0;
    super.reset();
  }
}
