import { UserLoginDto } from '../../models/user-login-dto';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IAuthClient {
  /**
   * @param body Body for the endpoint.
   */
  postApiAuthLogin(body: UserLoginDto): Promise<TypedResponse<string>>;
  postApiAuthRefresh(): Promise<TypedResponse<string>>;
}
