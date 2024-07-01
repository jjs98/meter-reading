import { MeterType } from './meter-type';

export type MeterDto = {
    id?: number;
    owner: (string) | (null);
    location: (string) | (null);
    meterNumber: (string) | (null);
    comment?: (string) | (null);
    type?: MeterType;
  };
