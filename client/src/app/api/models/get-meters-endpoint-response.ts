import type { MeterType } from './meter-type';

export type GetMetersEndpointResponse = {
    id?: number;
    userId?: number;
    location?: string;
    meterNumber?: (string) | (null);
    addition?: (string) | (null);
    type?: MeterType;
  };
