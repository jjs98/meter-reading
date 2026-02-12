import type { MeterType } from './meter-type';

export type UpdateMeterEndpointRequest = {
    userId?: number;
    location?: string;
    meterNumber?: (string) | (null);
    addition?: (string) | (null);
    type?: MeterType;
  };
