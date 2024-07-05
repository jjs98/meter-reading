import { User } from '../../models/user';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IUserClient {
  getApiUser(): Promise<TypedResponse<(User)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postApiUser(body: User): Promise<TypedResponse<User>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getApiUserId(params: {
      id: number;
    }): Promise<TypedResponse<User>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putApiUserId(params: {
      id: number;
    }, body: User): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteApiUserId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
