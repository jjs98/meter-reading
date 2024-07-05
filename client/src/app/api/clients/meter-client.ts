import { IMeterClient } from './interfaces/meter-client';
import { Meter } from '../models/meter';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const METER_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class MeterClient implements IMeterClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...METER_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  public getApiMeter(): Promise<TypedResponse<(Meter)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Meter')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(Meter)[]>>;
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiMeter(body: Meter): Promise<TypedResponse<Meter>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Meter')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Meter>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiMeterId(params: {
      id: number;
    }): Promise<TypedResponse<Meter>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Meter/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Meter>>;
  }

  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  public putApiMeterId(params: {
      id: number;
    }, body: Meter): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Meter/{id}')
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
  public deleteApiMeterId(params: {
      id: number;
    }): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Meter/{id}')
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
