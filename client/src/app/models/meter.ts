import { MeterType } from './meter-type.enum';

export interface Meter {
  id?: number;
  userId: number | undefined;
  location: string | undefined;
  meterNumber?: string | null | undefined;
  addition?: string | null | undefined;
  type?: MeterType;
}
