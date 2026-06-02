import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { TooltipDirective } from '../../directives/tooltip.directive';
import { Reading } from '../../models/reading';
import { ConfirmationService } from '../../services/confirmation.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-reading-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './reading-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingDialogComponent {
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);
  private isEdit = false;
  private lastReadingDate: string | undefined = undefined;

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected number: number | undefined = undefined;
  protected readingDate: WritableSignal<string | undefined> = signal(undefined);

  protected dialogVisible = signal(false);
  protected loading = signal(false);
  protected hasReadingForDate = computed((): boolean => {
    const readingDate = this.readingDate();
    if (readingDate === this.lastReadingDate) return false;
    if (!readingDate) return false;

    const hasReading =
      this.dataStore
        .readings()
        .find(
          (r): boolean =>
            new Date(r.readingDate).toISOString() ===
            new Date(readingDate)?.toISOString()
        ) !== undefined;
    return hasReading;
  });

  public readonly meterId = input<number>();
  public readonly currentDate = new Date();
  public existingReading: Reading | undefined = undefined;

  public constructor() {
    effect((): void => {
      if (!this.dialogVisible()) {
        this.resetDialog();
      }
    });
  }

  public showDialog(reading: Reading | undefined = undefined): void {
    if (reading) {
      this.isEdit = true;
      this.existingReading = reading;
      this.number = Number(reading.number ?? undefined);
      this.readingDate.set(
        new Date(reading.readingDate ?? undefined).toISOString().split('T')[0]
      );
      console.log(this.readingDate());
      this.lastReadingDate = this.readingDate();
    } else {
      const currentDate = new Date();
      this.readingDate.set(
        `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
      );
    }

    this.dialogVisible.set(true);
  }

  protected onCancel(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(): Promise<void> {
    this.loading.set(true);
    const meterId = this.meterId();
    if (!meterId) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: 'Error',
        detail: 'Could not determine Meter',
      });
      this.loading.set(false);
      return;
    }
    const readingDate = this.readingDate();
    if (this.number === undefined || !readingDate) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: 'Error',
        detail: 'Please fill out all fields',
      });
      this.loading.set(false);
      return;
    }

    if (this.isEdit) {
      await this.editReading();
    } else {
      await this.addReading(meterId);
    }
  }

  protected async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter' && !this.readingDate && !this.number) {
      await this.onSave();
    }
  }

  protected hasReadingChanged(): boolean {
    const reading = this.existingReading;
    if (!reading) {
      return true;
    }

    return (
      this.number != Number(reading.number) ||
      this.readingDate() !=
        new Date(reading.readingDate).toISOString().split('T')[0]
    );
  }

  protected async confirmDeleteReading(): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.reading_confirmDelete_header(),
      message: this.translations.reading_confirmDelete_message(),
      confirmCallback: async (): Promise<void> => {
        this.deleteReading();
      },
    });
  }

  private async deleteReading(): Promise<void> {
    const readingId = this.existingReading?.id;
    if (!readingId) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.error(),
        detail: this.translations.reading_error_determine(),
      });
      return;
    }
    const meterId = this.meterId();
    if (!meterId) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      return;
    }
    const deleted = await this.dataStore.deleteReading(readingId, meterId);
    if (deleted) {
      this.dialogVisible.set(false);
    }
  }

  private resetDialog(): void {
    this.number = undefined;
    this.readingDate.set(undefined);

    this.isEdit = false;
    this.existingReading = undefined;
    this.lastReadingDate = undefined;
  }

  private async addReading(meterId: number): Promise<void> {
    const readingDate = this.readingDate();
    const successfulAdded = await this.dataStore.addReading({
      meterId: meterId,
      number: this.number?.toString() ?? '',
      readingDate: readingDate ? new Date(readingDate).toISOString() : '',
    });
    this.loading.set(false);
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  private async editReading(): Promise<void> {
    const readingDate = this.readingDate();
    const reading = this.existingReading;
    if (!reading) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      this.loading.set(false);
      return;
    }

    const successfulUpdated = await this.dataStore.updateReading({
      id: reading.id,
      meterId: reading.meterId,
      number: this.number?.toString() ?? '',
      readingDate: readingDate ? new Date(readingDate).toISOString() : '',
    });
    this.loading.set(false);
    if (successfulUpdated) {
      this.dialogVisible.set(false);
    }
  }
}
