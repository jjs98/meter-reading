import { MeterType } from './meter-type';
import { Reading } from './reading';

export type Meter = {
    id?: number;
    createDate?: string;
    updateDate?: (string) | (null);
    userId: number;
    location: (string) | (null);
    meterNumber?: (string) | (null);
    addition?: (string) | (null);
    type?: MeterType;
    readings?: ((Reading)[]) | (null);
  };
