import type { MeterType } from './meter-type';
import type { Reading } from './reading';

export interface Meter {
    id?: number;
    createDate?: string;
    updateDate?: (string) | (null);
    userId: number;
    location: (string) | (null);
    meterNumber?: (string) | (null);
    addition?: (string) | (null);
    type?: MeterType;
    readings?: ((Reading)[]) | (null);
  }
