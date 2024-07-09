import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { Meter, MeterType } from '../../api/models';
import { TranslationService } from '../../services/translation.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-meter-dialog',
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
  templateUrl: './meter-dialog.component.html',
  styleUrl: './meter-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDialogComponent {
  protected readonly dataStore = inject(DataStore);
  private readonly messageService = inject(MessageService);

  protected readonly translations = inject(TranslationService).translations;

  protected location: string | undefined = undefined;
  protected meterNumber: string | undefined = undefined;
  protected comment: string | undefined = undefined;
  protected type: MeterType | undefined = undefined;

  protected dialogVisible = signal(false);

  private isEdit = false;

  public existingMeter = signal<Meter | undefined>(undefined);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.resetDialog();
      }
    });
  }

  public showDialog(meter: Meter | undefined = undefined): void {
    if (meter) {
      this.isEdit = true;
      this.existingMeter.set(meter);
      this.location = meter.location ?? undefined;
      this.meterNumber = meter.meterNumber ?? undefined;
      this.comment = meter.comment ?? undefined;
      this.type = meter.type;
    }

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

    if (this.isEdit) {
      await this.editMeter();
    } else {
      await this.addMeter(userId);
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

  protected hasMeterChanged(): boolean {
    const meter = this.existingMeter();
    if (!meter) {
      return false;
    }

    return (
      this.location != meter.location ||
      this.meterNumber != meter.meterNumber ||
      this.comment != meter.comment ||
      this.type != meter.type
    );
  }

  private resetDialog(): void {
    this.location = undefined;
    this.meterNumber = undefined;
    this.comment = undefined;
    this.type = undefined;
  }

  private async addMeter(userId: number): Promise<void> {
    const successfulAdded = await this.dataStore.addMeter({
      userId: userId,
      meterNumber: this.meterNumber ?? null,
      location: this.location ?? null,
      type: this.type,
      comment: this.comment,
    });
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  private async editMeter(): Promise<void> {
    if (!this.existingMeter()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not determine Meter',
      });
      return;
    }

    const successfulUpdated = await this.dataStore.updateMeter({
      id: this.existingMeter()?.id,
      userId: this.existingMeter()?.userId ?? -1,
      meterNumber: this.meterNumber ?? null,
      location: this.location ?? null,
      type: this.type,
      comment: this.comment,
    });
    if (successfulUpdated) {
      this.dialogVisible.set(false);
    }
  }
}
