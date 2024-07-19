import { ProblemDetails } from '../models/problem-details';
import { TokenDto } from '../models/token-dto';
import { UserLoginDto } from '../models/user-login-dto';
import { EasyNetworkStubBase, StrictRouteResponseCallback, StubRequestInfo, getStubResponder } from '../utils/easy-network-stub.utils';

const postApiAuthLoginResponder = getStubResponder<{
    200: TokenDto;
    401: ProblemDetails;
    403: never;
    500: never;
  }>();

const postApiAuthRefreshResponder = getStubResponder<{
    200: TokenDto;
    400: ProblemDetails;
    401: never;
    403: never;
    500: never;
  }>();

const postApiAuthHashResponder = getStubResponder<{
    200: string;
    401: never;
    403: never;
    500: never;
  }>();

export class AuthStubs extends EasyNetworkStubBase {
  private static readonly POST_API_AUTH_LOGIN_PATH = 'api/Auth/login' as const;
  private static readonly POST_API_AUTH_REFRESH_PATH = 'api/Auth/refresh' as const;
  private static readonly POST_API_AUTH_HASH_PATH = 'api/Auth/hash' as const;

  private readonly _postApiAuthLoginRequests: (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_LOGIN_PATH, UserLoginDto>)[] = [];
  private readonly _postApiAuthRefreshRequests: (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_REFRESH_PATH, unknown>)[] = [];
  private readonly _postApiAuthHashRequests: (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_HASH_PATH, string>)[] = [];

  public get postApiAuthLoginRequests(): readonly (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_LOGIN_PATH, UserLoginDto>)[] {
    return this._postApiAuthLoginRequests;
  }
  public get postApiAuthRefreshRequests(): readonly (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_REFRESH_PATH, unknown>)[] {
    return this._postApiAuthRefreshRequests;
  }
  public get postApiAuthHashRequests(): readonly (StubRequestInfo<typeof AuthStubs.POST_API_AUTH_HASH_PATH, string>)[] {
    return this._postApiAuthHashRequests;
  }

  public stubPostApiAuthLogin(response: StrictRouteResponseCallback<
      UserLoginDto,
      typeof AuthStubs.POST_API_AUTH_LOGIN_PATH,
      typeof postApiAuthLoginResponder
    >): this {
    this.stubWrapper.stub2<UserLoginDto>()(
      'POST',
      AuthStubs.POST_API_AUTH_LOGIN_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiAuthLoginRequests.push(request);
        }
        throw await response(postApiAuthLoginResponder, request);
      }
    );
    return this;
  }

  public stubPostApiAuthRefresh(response: StrictRouteResponseCallback<
      unknown,
      typeof AuthStubs.POST_API_AUTH_REFRESH_PATH,
      typeof postApiAuthRefreshResponder
    >): this {
    this.stubWrapper.stub2<unknown>()(
      'POST',
      AuthStubs.POST_API_AUTH_REFRESH_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiAuthRefreshRequests.push(request);
        }
        throw await response(postApiAuthRefreshResponder, request);
      }
    );
    return this;
  }

  public stubPostApiAuthHash(response: StrictRouteResponseCallback<
      string,
      typeof AuthStubs.POST_API_AUTH_HASH_PATH,
      typeof postApiAuthHashResponder
    >): this {
    this.stubWrapper.stub2<string>()(
      'POST',
      AuthStubs.POST_API_AUTH_HASH_PATH,
      async (request) => {
        if (this.stubWrapper.options.rememberRequests) {
          this._postApiAuthHashRequests.push(request);
        }
        throw await response(postApiAuthHashResponder, request);
      }
    );
    return this;
  }

  public override reset(): void {
    this._postApiAuthLoginRequests.length = 0;
    this._postApiAuthRefreshRequests.length = 0;
    this._postApiAuthHashRequests.length = 0;
    super.reset();
  }
}
