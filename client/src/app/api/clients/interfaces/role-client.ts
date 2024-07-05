import { Role } from '../../models/role';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IRoleClient {
  getApiRole(): Promise<TypedResponse<(Role)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postApiRole(body: Role): Promise<TypedResponse<Role>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getApiRoleId(params: {
      id: number;
    }): Promise<TypedResponse<Role>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putApiRoleId(params: {
      id: number;
    }, body: Role): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteApiRoleId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
