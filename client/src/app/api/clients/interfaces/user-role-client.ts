import { UserRole } from '../../models/user-role';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IUserRoleClient {
  /**
   * @param params Parameters for the endpoint.
   */
  getApiUserRoleRoleRoleId(params: {
      roleId: number;
    }): Promise<TypedResponse<(UserRole)[]>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getApiUserRoleUserUserId(params: {
      userId: number;
    }): Promise<TypedResponse<(UserRole)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postApiUserRole(body: UserRole): Promise<TypedResponse<UserRole>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putApiUserRoleId(params: {
      id: number;
    }, body: UserRole): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteApiUserRoleId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
