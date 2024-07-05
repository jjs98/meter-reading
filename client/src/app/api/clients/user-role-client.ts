import { IUserRoleClient } from './interfaces/user-role-client';
import { UserRole } from '../models/user-role';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const USER_ROLE_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class UserRoleClient implements IUserRoleClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...USER_ROLE_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiUserRoleRoleRoleId(params: {
      roleId: number;
    }): Promise<TypedResponse<(UserRole)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/UserRole/role/{roleId}')
      .withPathParam('roleId', params.roleId)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(UserRole)[]>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiUserRoleUserUserId(params: {
      userId: number;
    }): Promise<TypedResponse<(UserRole)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/UserRole/user/{userId}')
      .withPathParam('userId', params.userId)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(UserRole)[]>>;
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiUserRole(body: UserRole): Promise<TypedResponse<UserRole>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/UserRole')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<UserRole>>;
  }

  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  public putApiUserRoleId(params: {
      id: number;
    }, body: UserRole): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/UserRole/{id}')
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
  public deleteApiUserRoleId(params: {
      id: number;
    }): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/UserRole/{id}')
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
