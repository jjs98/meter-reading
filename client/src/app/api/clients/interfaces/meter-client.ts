import { Meter } from '../../models/meter';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IMeterClient {
  getApiMeter(): Promise<TypedResponse<(Meter)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postApiMeter(body: Meter): Promise<TypedResponse<Meter>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getApiMeterId(params: {
      id: number;
    }): Promise<TypedResponse<Meter>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putApiMeterId(params: {
      id: number;
    }, body: Meter): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteApiMeterId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
