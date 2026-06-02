import { Injectable, signal } from '@angular/core';

export interface Confirmation {
  header: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmCallback?: () => Promise<void>;
  cancelCallback?: () => Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  public confirmation = signal({} as Confirmation);
  public dialogVisible = signal(false);

  public confirm(confirmation: Confirmation): void {
    this.confirmation.set(confirmation);
    this.dialogVisible.set(true);
  }

  public close(): void {
    this.dialogVisible.set(false);
    this.confirmation.set({} as Confirmation);
  }
}
