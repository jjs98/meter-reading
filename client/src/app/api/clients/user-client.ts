import { IUserClient } from './interfaces/user-client';
import { User } from '../models/user';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const USER_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class UserClient implements IUserClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...USER_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  public getApiUser(): Promise<TypedResponse<(User)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/User')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(User)[]>>;
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiUser(body: User): Promise<TypedResponse<User>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/User')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<User>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiUserId(params: {
      id: number;
    }): Promise<TypedResponse<User>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/User/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<User>>;
  }

  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  public putApiUserId(params: {
      id: number;
    }, body: User): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/User/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'PUT',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: true });
    return response as unknown as Promise<TypedResponse<void>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public deleteApiUserId(params: {
      id: number;
    }): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/User/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'DELETE',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: true });
    return response as unknown as Promise<TypedResponse<void>>;
  }
}
