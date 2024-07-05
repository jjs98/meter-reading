import { IReadingClient } from './interfaces/reading-client';
import { Reading } from '../models/reading';
import { FetchClientOptions, TypedResponse, UrlBuilder } from '../utils/fetch-client.utils';

export const READING_CLIENT_DEFAULT_OPTIONS: FetchClientOptions = {};

export class ReadingClient implements IReadingClient {
  /**
   * Options for the fetch client.
   */
  public options: FetchClientOptions;

  constructor(options?: Partial<FetchClientOptions>) {
    this.options = { ...READING_CLIENT_DEFAULT_OPTIONS, ...options };
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiReading(params: {
      meterId?: number;
    }): Promise<TypedResponse<(Reading)[]>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Reading')
      .withQueryParam('meterId', params.meterId)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<(Reading)[]>>;
  }

  /**
   * @param body Body for the endpoint.
   */
  public postApiReading(body: Reading): Promise<TypedResponse<Reading>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Reading')
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'POST',
      headers: this.options.headers,
      body: JSON.stringify(body),
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Reading>>;
  }

  /**
   * @param params Parameters for the endpoint.
   */
  public getApiReadingId(params: {
      id: number;
    }): Promise<TypedResponse<Reading>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Reading/{id}')
      .withPathParam('id', params.id)
      .build();
    const response = (this.options.fetch ?? fetch)(url, {
      method: 'GET',
      headers: this.options.headers,
    });
    Object.defineProperty(response, 'isVoidResponse', { value: false });
    return response as unknown as Promise<TypedResponse<Reading>>;
  }

  /**
   * @param params Parameters for the endpoint.
   * @param body Body for the endpoint.
   */
  public putApiReadingId(params: {
      id: number;
    }, body: Reading): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Reading/{id}')
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
  public deleteApiReadingId(params: {
      id: number;
    }): Promise<TypedResponse<void>> {
    const url = new UrlBuilder(this.options.baseUrl)
      .withPath('/api/Reading/{id}')
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
