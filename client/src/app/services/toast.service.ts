import { Injectable, signal } from '@angular/core';

export interface ToastConfig {
  severity?: 'success' | 'info' | 'warning' | 'error';
  summary?: string;
  detail?: string;
  duration?: number; // ms
  showClose?: boolean;
  closeOnClick?: boolean;
}

export interface ToastMessage extends ToastConfig {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;

  public add(config: ToastConfig): void {
    const id = ++this.idCounter;
    const toast: ToastMessage = {
      id,
      severity: config.severity,
      summary: config.summary ?? '',
      detail: config.detail ?? '',
      duration: config.duration ?? 5000,
      showClose: config.showClose ?? true,
      closeOnClick: config.closeOnClick ?? false,
    };
    this.toasts.set([...this.toasts(), toast]);
    setTimeout((): void => this.remove(id), toast.duration);
  }

  public remove(id: number): void {
    this.toasts.set(this.toasts().filter((t): boolean => t.id !== id));
  }

  public clear(): void {
    this.toasts.set([]);
  }
}
