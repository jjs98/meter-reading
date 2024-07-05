import { IAuthClient } from './interfaces/auth-client';
import { UserLoginDto } from '../models/user-login-dto';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const AUTH_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class AuthClient implements IAuthClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...AUTH_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiAuthLogin(body: UserLoginDto): Promise<TypedResponse<string>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Auth/login')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<string>>;
  }

  public postApiAuthRefresh(): Promise<TypedResponse<string>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Auth/refresh')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<string>>;
  }
}
