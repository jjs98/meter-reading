import { Reading } from '../../models/reading';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IReadingClient {
  /**
   * @param params Parameters for the endpoint.
   */
  getApiReading(params: {
      meterId?: number;
    }): Promise<TypedResponse<(Reading)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postApiReading(body: Reading): Promise<TypedResponse<Reading>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getApiReadingId(params: {
      id: number;
    }): Promise<TypedResponse<Reading>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putApiReadingId(params: {
      id: number;
    }, body: Reading): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteApiReadingId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
