import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

import { Meter, MeterType } from '../../api/models';
import { TranslateService } from '../../services/translate.service';
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
    TooltipModule,
  ],
  templateUrl: './meter-dialog.component.html',
  styleUrl: './meter-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDialogComponent {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  protected location: string | undefined = undefined;
  protected meterNumber: string | undefined = undefined;
  protected addition: string | undefined = undefined;
  protected type: MeterType | undefined = undefined;

  protected dialogVisible = signal(false);

  private isEdit = false;

  public existingMeter: Meter | undefined = undefined;

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
      this.existingMeter = meter;
      this.location = meter.location ?? undefined;
      this.meterNumber = meter.meterNumber ?? undefined;
      this.addition = meter.addition ?? undefined;
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
    if (!this.location || this.type === undefined) {
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
    if (event.key === 'Enter' && this.location !== '' && this.type !== undefined) {
      await this.onSave();
    }
  }

  protected hasMeterChanged(): boolean {
    const meter = this.existingMeter;
    if (!meter) {
      return true;
    }

    return (
      this.location != meter.location ||
      this.meterNumber != meter.meterNumber ||
      this.addition != meter.addition ||
      this.type != meter.type
    );
  }

  protected async confirmDeleteMeter(): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.confirmDelete_header(),
      message: this.translations.confirmDelete_message(),
      icon: 'i-[mdi--alert-circle]',
      acceptButtonStyleClass: 'p-button-danger p-button',
      rejectButtonStyleClass: 'p-button',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteMeter();
      },
      reject: () => {},
    });
  }

  private async deleteMeter(): Promise<void> {
    const meterId = this.existingMeter?.id;
    if (!meterId) {
      this.messageService.add({
        severity: 'error',
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      return;
    }
    const deleted = await this.dataStore.deleteMeter(meterId);
    if (deleted) {
      this.dialogVisible.set(false);
    }
  }

  private resetDialog(): void {
    this.location = undefined;
    this.meterNumber = undefined;
    this.addition = undefined;
    this.type = undefined;

    this.isEdit = false;
    this.existingMeter = undefined;
  }

  private async addMeter(userId: number): Promise<void> {
    const successfulAdded = await this.dataStore.addMeter({
      userId: userId,
      meterNumber: this.meterNumber ?? null,
      location: this.location ?? null,
      type: this.type,
      addition: this.addition,
    });
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  private async editMeter(): Promise<void> {
    const meter = this.existingMeter;
    if (!meter) {
      this.messageService.add({
        severity: 'error',
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      return;
    }

    const successfulUpdated = await this.dataStore.updateMeter({
      id: meter.id,
      userId: meter.userId ?? -1,
      meterNumber: this.meterNumber ?? null,
      location: this.location ?? null,
      type: this.type,
      addition: this.addition,
    });
    if (successfulUpdated) {
      this.dialogVisible.set(false);
    }
  }
}
