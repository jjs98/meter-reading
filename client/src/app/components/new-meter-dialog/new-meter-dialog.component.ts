import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { TranslationService } from './../../services/translation.service';
import { MeterType } from '../../api/models';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-new-meter-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
  ],
  templateUrl: './new-meter-dialog.component.html',
  styleUrl: './new-meter-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMeterDialogComponent {
  protected readonly dataStore = inject(DataStore);
  private readonly messageService = inject(MessageService);

  protected readonly translations = inject(TranslationService).translations;

  protected location: string | undefined = undefined;
  protected meterNumber: string | undefined = undefined;
  protected comment: string | undefined = undefined;
  protected type: MeterType | undefined = undefined;

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
    const userId = this.dataStore.user()?.id;
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not determine User',
      });
      return;
    }
    if (!this.location || !this.meterNumber || !this.type) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields',
      });
      return;
    }

    const successfulAdded = await this.dataStore.addMeter({
      userId: userId,
      meterNumber: this.meterNumber,
      location: this.location,
      type: this.type,
      comment: this.comment,
    });
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  protected async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (
      event.key === 'Enter' &&
      this.location !== '' &&
      this.meterNumber !== '' &&
      this.type !== undefined
    ) {
      await this.onSave();
    }
  }

  private resetDialog(): void {
    this.location = undefined;
    this.meterNumber = undefined;
    this.comment = undefined;
    this.type = undefined;
  }
}
