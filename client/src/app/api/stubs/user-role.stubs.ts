import { EasyNetworkStubBase, getStubResponder } from '../utils/easy-network-stub.utils';

import type { ProblemDetails } from '../models/problem-details';
import type { UserRole } from '../models/user-role';
import type { StrictRouteResponseCallback, StubRequestInfo } from '../utils/easy-network-stub.utils';

const getApiUserRoleRoleRoleIdResponder = getStubResponder<{
    200: (UserRole)[];
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const getApiUserRoleUserUserIdResponder = getStubResponder<{
    200: (UserRole)[];
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const postApiUserRoleResponder = getStubResponder<{
    201: UserRole;
    401: never;
    403: never;
    500: never;
  }>();

const putApiUserRoleIdResponder = getStubResponder<{
    204: never;
    400: ProblemDetails;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiUserRoleIdResponder = getStubResponder<{
    204: never;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class UserRoleStubs extends EasyNetworkStubBase {
  private static readonly GET_API_USER_ROLE_ROLE_ROLE_ID_PATH = 'api/UserRole/role/{roleId:number}' as const;
  private static readonly GET_API_USER_ROLE_USER_USER_ID_PATH = 'api/UserRole/user/{userId:number}' as const;
  private static readonly POST_API_USER_ROLE_PATH = 'api/UserRole' as const;
  private static readonly PUT_API_USER_ROLE_ID_PATH = 'api/UserRole/{id:number}' as const;
  private static readonly DELETE_API_USER_ROLE_ID_PATH = 'api/UserRole/{id:number}' as const;

  private readonly _getApiUserRoleRoleRoleIdRequests: (StubRequestInfo<typeof UserRoleStubs.GET_API_USER_ROLE_ROLE_ROLE_ID_PATH, unknown>)[] = [];
  private readonly _getApiUserRoleUserUserIdRequests: (StubRequestInfo<typeof UserRoleStubs.GET_API_USER_ROLE_USER_USER_ID_PATH, unknown>)[] = [];
  private readonly _postApiUserRoleRequests: (StubRequestInfo<typeof UserRoleStubs.POST_API_USER_ROLE_PATH, UserRole>)[] = [];
  private readonly _putApiUserRoleIdRequests: (StubRequestInfo<typeof UserRoleStubs.PUT_API_USER_ROLE_ID_PATH, UserRole>)[] = [];
  private readonly _deleteApiUserRoleIdRequests: (StubRequestInfo<typeof UserRoleStubs.DELETE_API_USER_ROLE_ID_PATH, unknown>)[] = [];

  public get getApiUserRoleRoleRoleIdRequests(): readonly (StubRequestInfo<typeof UserRoleStubs.GET_API_USER_ROLE_ROLE_ROLE_ID_PATH, unknown>)[] {
    return this._getApiUserRoleRoleRoleIdRequests;
  }
  public get getApiUserRoleUserUserIdRequests(): readonly (StubRequestInfo<typeof UserRoleStubs.GET_API_USER_ROLE_USER_USER_ID_PATH, unknown>)[] {
    return this._getApiUserRoleUserUserIdRequests;
  }
  public get postApiUserRoleRequests(): readonly (StubRequestInfo<typeof UserRoleStubs.POST_API_USER_ROLE_PATH, UserRole>)[] {
    return this._postApiUserRoleRequests;
  }
  public get putApiUserRoleIdRequests(): readonly (StubRequestInfo<typeof UserRoleStubs.PUT_API_USER_ROLE_ID_PATH, UserRole>)[] {
    return this._putApiUserRoleIdRequests;
  }
  public get deleteApiUserRoleIdRequests(): readonly (StubRequestInfo<typeof UserRoleStubs.DELETE_API_USER_ROLE_ID_PATH, unknown>)[] {
    return this._deleteApiUserRoleIdRequests;
  }

  public stubGetApiUserRoleRoleRoleId(response: StrictRouteResponseCallback<
      unknown,
      typeof UserRoleStubs.GET_API_USER_ROLE_ROLE_ROLE_ID_PATH,
      typeof getApiUserRoleRoleRoleIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      UserRoleStubs.GET_API_USER_ROLE_ROLE_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiUserRoleRoleRoleIdRequests.push(request);
        }
        throw await response(getApiUserRoleRoleRoleIdResponder, request);
      }
    );
    return this;
  }

  public stubGetApiUserRoleUserUserId(response: StrictRouteResponseCallback<
      unknown,
      typeof UserRoleStubs.GET_API_USER_ROLE_USER_USER_ID_PATH,
      typeof getApiUserRoleUserUserIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      UserRoleStubs.GET_API_USER_ROLE_USER_USER_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiUserRoleUserUserIdRequests.push(request);
        }
        throw await response(getApiUserRoleUserUserIdResponder, request);
      }
    );
    return this;
  }

  public stubPostApiUserRole(response: StrictRouteResponseCallback<
      UserRole,
      typeof UserRoleStubs.POST_API_USER_ROLE_PATH,
      typeof postApiUserRoleResponder
    >): this {
    this.stubWrapper.stub2<UserRole>()(
      'POST',
      UserRoleStubs.POST_API_USER_ROLE_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiUserRoleRequests.push(request);
        }
        throw await response(postApiUserRoleResponder, request);
      }
    );
    return this;
  }

  public stubPutApiUserRoleId(response: StrictRouteResponseCallback<
      UserRole,
      typeof UserRoleStubs.PUT_API_USER_ROLE_ID_PATH,
      typeof putApiUserRoleIdResponder
    >): this {
    this.stubWrapper.stub2<UserRole>()(
      'PUT',
      UserRoleStubs.PUT_API_USER_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putApiUserRoleIdRequests.push(request);
        }
        throw await response(putApiUserRoleIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiUserRoleId(response: StrictRouteResponseCallback<
      unknown,
      typeof UserRoleStubs.DELETE_API_USER_ROLE_ID_PATH,
      typeof deleteApiUserRoleIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      UserRoleStubs.DELETE_API_USER_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiUserRoleIdRequests.push(request);
        }
        throw await response(deleteApiUserRoleIdResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getApiUserRoleRoleRoleIdRequests.length = 0;
    this._getApiUserRoleUserUserIdRequests.length = 0;
    this._postApiUserRoleRequests.length = 0;
    this._putApiUserRoleIdRequests.length = 0;
    this._deleteApiUserRoleIdRequests.length = 0;
    super.reset();
  }
}
