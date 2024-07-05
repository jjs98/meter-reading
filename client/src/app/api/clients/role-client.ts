import { IRoleClient } from './interfaces/role-client';
import { Role } from '../models/role';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const ROLE_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class RoleClient implements IRoleClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...ROLE_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  public getApiRole(): Promise<TypedResponse<(Role)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Role')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(Role)[]>>;
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiRole(body: Role): Promise<TypedResponse<Role>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Role')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Role>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiRoleId(params: {
      id: number;
    }): Promise<TypedResponse<Role>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Role/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Role>>;
  }

  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  public putApiRoleId(params: {
      id: number;
    }, body: Role): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Role/{id}')
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
  public deleteApiRoleId(params: {
      id: number;
    }): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Role/{id}')
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
