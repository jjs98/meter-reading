import { MeterDto } from '../../models/meter-dto';
import { TypedResponse } from '../../utils/fetch-client.utils';

export interface IMeterClient {
  getMeter(): Promise<TypedResponse<(MeterDto)[]>>;
  /**
   * @param body Body for the endpoint.
   */
  postMeter(body: MeterDto): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  getMeterId(params: {
      id: number;
    }): Promise<TypedResponse<MeterDto>>;
  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  putMeterId(params: {
      id: number;
    }, body: MeterDto): Promise<TypedResponse<void>>;
  /**
   * @param params Parameters for the endpoint.
   */
  deleteMeterId(params: {
      id: number;
    }): Promise<TypedResponse<void>>;
}
