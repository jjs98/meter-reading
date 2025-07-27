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
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

import { Reading } from '../../api/models';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-reading-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DatePickerModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    RadioButtonModule,
    TooltipModule,
  ],
  templateUrl: './reading-dialog.component.html',
  styleUrl: './reading-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingDialogComponent {
  public readonly meterId = input<number>();
  public readonly currentDate = new Date();
  public existingReading: Reading | undefined = undefined;

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected number: number | undefined = undefined;
  protected readingDate: WritableSignal<Date | undefined> = signal(undefined);

  protected dialogVisible = signal(false);
  protected hasReadingForDate = computed((): boolean => {
    if (this.readingDate() === this.lastReadingDate) return false;

    const hasReading =
      this.dataStore
        .readings()
        .find(
          (r): boolean =>
            new Date(r.readingDate).toISOString() ===
            this.readingDate()?.toISOString()
        ) !== undefined;
    return hasReading;
  });

  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);
  private isEdit = false;
  private lastReadingDate: Date | undefined = undefined;

  public constructor() {
    effect(
      (): void => {
        if (!this.dialogVisible()) {
          this.resetDialog();
        }
      },
      { allowSignalWrites: true }
    );
  }

  public showDialog(reading: Reading | undefined = undefined): void {
    if (reading) {
      this.isEdit = true;
      this.existingReading = reading;
      this.number = Number(reading.number ?? undefined);
      this.readingDate.set(new Date(reading.readingDate ?? undefined));
      this.lastReadingDate = this.readingDate();
    } else {
      const currentDate = new Date();
      this.readingDate.set(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
    }

    this.dialogVisible.set(true);
  }

  protected onCancel(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(): Promise<void> {
    const meterId = this.meterId();
    if (!meterId) {
      this.toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not determine Meter',
      });
      return;
    }
    const readingDate = this.readingDate();
    if (this.number === undefined || !readingDate) {
      this.toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields',
      });
      return;
    }
    this.readingDate.set(this.toUTC(readingDate));

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

  protected toUTC(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  protected hasReadingChanged(): boolean {
    const reading = this.existingReading;
    if (!reading) {
      return true;
    }

    return (
      this.number != Number(reading.number) ||
      this.readingDate()?.toISOString() !=
        new Date(reading.readingDate).toISOString()
    );
  }

  protected async confirmDeleteReading(): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.reading_confirmDelete_header(),
      message: this.translations.reading_confirmDelete_message(),
      icon: 'i-[mdi--alert-circle]',
      acceptButtonStyleClass: 'p-button-danger p-button',
      rejectButtonStyleClass: 'p-button',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: (): void => {
        this.deleteReading();
      },
      reject: (): void => {
        // Do nothing on reject
      },
    });
  }

  private async deleteReading(): Promise<void> {
    const readingId = this.existingReading?.id;
    if (!readingId) {
      this.toastService.add({
        severity: 'error',
        summary: this.translations.error(),
        detail: this.translations.reading_error_determine(),
      });
      return;
    }
    const meterId = this.meterId();
    if (!meterId) {
      this.toastService.add({
        severity: 'error',
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
  }

  private async addReading(meterId: number): Promise<void> {
    const successfulAdded = await this.dataStore.addReading({
      meterId: meterId,
      number: this.number?.toString() ?? null,
      readingDate: this.readingDate()?.toISOString() ?? '',
    });
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  private async editReading(): Promise<void> {
    const reading = this.existingReading;
    if (!reading) {
      this.toastService.add({
        severity: 'error',
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      return;
    }

    const successfulUpdated = await this.dataStore.updateReading({
      id: reading.id,
      meterId: reading.meterId,
      number: this.number?.toString() ?? null,
      readingDate: this.readingDate()?.toISOString() ?? '',
    });
    if (successfulUpdated) {
      this.dialogVisible.set(false);
    }
  }
}
