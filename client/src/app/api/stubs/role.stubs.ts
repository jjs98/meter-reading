import { ProblemDetails } from '../models/problem-details';
import { Role } from '../models/role';
import { EasyNetworkStubBase, StrictRouteResponseCallback, StubRequestInfo, getStubResponder } from '../utils/easy-network-stub.utils';

const getApiRoleResponder = getStubResponder<{
    200: (Role)[];
    401: never;
    403: never;
    500: never;
  }>();

const postApiRoleResponder = getStubResponder<{
    201: Role;
    401: never;
    403: never;
    500: never;
  }>();

const getApiRoleIdResponder = getStubResponder<{
    200: Role;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const putApiRoleIdResponder = getStubResponder<{
    204: never;
    400: ProblemDetails;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

const deleteApiRoleIdResponder = getStubResponder<{
    204: never;
    401: never;
    403: never;
    404: ProblemDetails;
    500: never;
  }>();

export class RoleStubs extends EasyNetworkStubBase {
  private static readonly GET_API_ROLE_PATH = 'api/Role' as const;
  private static readonly POST_API_ROLE_PATH = 'api/Role' as const;
  private static readonly GET_API_ROLE_ID_PATH = 'api/Role/{id:number}' as const;
  private static readonly PUT_API_ROLE_ID_PATH = 'api/Role/{id:number}' as const;
  private static readonly DELETE_API_ROLE_ID_PATH = 'api/Role/{id:number}' as const;

  private readonly _getApiRoleRequests: (StubRequestInfo<typeof RoleStubs.GET_API_ROLE_PATH, unknown>)[] = [];
  private readonly _postApiRoleRequests: (StubRequestInfo<typeof RoleStubs.POST_API_ROLE_PATH, Role>)[] = [];
  private readonly _getApiRoleIdRequests: (StubRequestInfo<typeof RoleStubs.GET_API_ROLE_ID_PATH, unknown>)[] = [];
  private readonly _putApiRoleIdRequests: (StubRequestInfo<typeof RoleStubs.PUT_API_ROLE_ID_PATH, Role>)[] = [];
  private readonly _deleteApiRoleIdRequests: (StubRequestInfo<typeof RoleStubs.DELETE_API_ROLE_ID_PATH, unknown>)[] = [];

  public get getApiRoleRequests(): readonly (StubRequestInfo<typeof RoleStubs.GET_API_ROLE_PATH, unknown>)[] {
    return this._getApiRoleRequests;
  }
  public get postApiRoleRequests(): readonly (StubRequestInfo<typeof RoleStubs.POST_API_ROLE_PATH, Role>)[] {
    return this._postApiRoleRequests;
  }
  public get getApiRoleIdRequests(): readonly (StubRequestInfo<typeof RoleStubs.GET_API_ROLE_ID_PATH, unknown>)[] {
    return this._getApiRoleIdRequests;
  }
  public get putApiRoleIdRequests(): readonly (StubRequestInfo<typeof RoleStubs.PUT_API_ROLE_ID_PATH, Role>)[] {
    return this._putApiRoleIdRequests;
  }
  public get deleteApiRoleIdRequests(): readonly (StubRequestInfo<typeof RoleStubs.DELETE_API_ROLE_ID_PATH, unknown>)[] {
    return this._deleteApiRoleIdRequests;
  }

  public stubGetApiRole(response: StrictRouteResponseCallback<
      unknown,
      typeof RoleStubs.GET_API_ROLE_PATH,
      typeof getApiRoleResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      RoleStubs.GET_API_ROLE_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiRoleRequests.push(request);
        }
        throw await response(getApiRoleResponder, request);
      }
    );
    return this;
  }

  public stubPostApiRole(response: StrictRouteResponseCallback<
      Role,
      typeof RoleStubs.POST_API_ROLE_PATH,
      typeof postApiRoleResponder
    >): this {
    this.stubWrapper.stub2<Role>()(
      'POST',
      RoleStubs.POST_API_ROLE_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiRoleRequests.push(request);
        }
        throw await response(postApiRoleResponder, request);
      }
    );
    return this;
  }

  public stubGetApiRoleId(response: StrictRouteResponseCallback<
      unknown,
      typeof RoleStubs.GET_API_ROLE_ID_PATH,
      typeof getApiRoleIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'GET',
      RoleStubs.GET_API_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._getApiRoleIdRequests.push(request);
        }
        throw await response(getApiRoleIdResponder, request);
      }
    );
    return this;
  }

  public stubPutApiRoleId(response: StrictRouteResponseCallback<
      Role,
      typeof RoleStubs.PUT_API_ROLE_ID_PATH,
      typeof putApiRoleIdResponder
    >): this {
    this.stubWrapper.stub2<Role>()(
      'PUT',
      RoleStubs.PUT_API_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._putApiRoleIdRequests.push(request);
        }
        throw await response(putApiRoleIdResponder, request);
      }
    );
    return this;
  }

  public stubDeleteApiRoleId(response: StrictRouteResponseCallback<
      unknown,
      typeof RoleStubs.DELETE_API_ROLE_ID_PATH,
      typeof deleteApiRoleIdResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'DELETE',
      RoleStubs.DELETE_API_ROLE_ID_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._deleteApiRoleIdRequests.push(request);
        }
        throw await response(deleteApiRoleIdResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._getApiRoleRequests.length = 0;
    this._postApiRoleRequests.length = 0;
    this._getApiRoleIdRequests.length = 0;
    this._putApiRoleIdRequests.length = 0;
    this._deleteApiRoleIdRequests.length = 0;
    super.reset();
  }
}
