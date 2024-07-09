import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-reading-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    RadioButtonModule,
  ],
  templateUrl: './reading-dialog.component.html',
  styleUrl: './reading-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingDialogComponent {
  protected readonly dataStore = inject(DataStore);
  private readonly messageService = inject(MessageService);

  public readonly meterId = input<number>();
  public readonly currentDate = new Date();

  protected number: number | undefined = undefined;
  protected readingDate: Date | undefined = undefined;

  protected dialogVisible = signal(false);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.resetDialog();
      }
    });
  }

  public showDialog(): void {
    this.dialogVisible.set(true);
  }

  protected onCancel(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(): Promise<void> {
    const meterId = this.meterId();
    if (!meterId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not determine Meter',
      });
      return;
    }
    if (!this.number || !this.readingDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields',
      });
      return;
    }

    const successfulAdded = await this.dataStore.addReading({
      meterId: meterId,
      number: this.number.toString(),
      readingDate: this.readingDate.toISOString(),
    });
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  protected async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter' && !this.readingDate && !this.number) {
      await this.onSave();
    }
  }

  private resetDialog(): void {
    this.number = undefined;
    this.readingDate = undefined;
  }
}
