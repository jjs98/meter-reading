import { Meter } from './meter';
import { UserRole } from './user-role';

export type User = {
    id?: number;
    createDate?: string;
    updateDate?: (string) | (null);
    username: (string) | (null);
    password: (string) | (null);
    firstName?: (string) | (null);
    lastName?: (string) | (null);
    email?: (string) | (null);
    roles?: ((UserRole)[]) | (null);
    meters?: ((Meter)[]) | (null);
  };
