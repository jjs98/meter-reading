import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { MeterType } from '../../api/models';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Meter } from '../../models/meter';
import { MeterShare } from '../../models/meter-share';
import { ConfirmationService } from '../../services/confirmation.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-meter-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './meter-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDialogComponent {
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);
  private isEdit = false;

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected location: string | undefined = undefined;
  protected meterNumber: string | undefined = undefined;
  protected addition: string | undefined = undefined;
  protected type: MeterType | undefined = undefined;

  protected shareUsername: string | undefined = undefined;
  protected sharedMeters: WritableSignal<MeterShare[]> = signal([]);

  protected dialogVisible = signal(false);
  protected loading = signal(false);

  public existingMeter: Meter | undefined = undefined;

  public constructor() {
    effect((): void => {
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

    this.refreshSharedMeter();
    this.dialogVisible.set(true);
  }

  protected async onCancel(): Promise<void> {
    this.dialogVisible.set(false);
    await this.dataStore.refreshMeters();
    await this.dataStore.refreshSharedMeters();
  }

  protected async refreshSharedMeter(): Promise<void> {
    if (this.existingMeter?.id) {
      this.sharedMeters.set(
        await this.dataStore.getSharedMeter(this.existingMeter.id)
      );
    }
  }

  protected async onSave(): Promise<void> {
    this.loading.set(true);
    const userId = this.dataStore.user()?.id;
    if (!userId) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: 'Error',
        detail: 'Could not determine User',
      });
      this.loading.set(false);
      return;
    }
    if (!this.location || this.type === undefined) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: 'Error',
        detail: 'Please fill out all fields',
      });
      this.loading.set(false);
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
      this.type !== undefined
    ) {
      await this.onSave();
    }
  }

  protected async onShareKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter') {
      await this.shareMeter();
    }
  }

  protected async shareMeter(): Promise<void> {
    if (
      this.shareUsername &&
      this.shareUsername !== '' &&
      this.existingMeter?.id
    ) {
      const succeeded = await this.dataStore.shareMeter(
        this.existingMeter.id,
        this.shareUsername
      );
      if (succeeded) {
        this.refreshSharedMeter();
        this.shareUsername = undefined;
      }
    }
  }

  protected async confirmRevokeShare(sharedMeter: MeterShare): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.meterShare_confirmDelete_header(),
      message: this.translations.meterShare_confirmDelete_message(),
      confirmCallback: async (): Promise<void> => {
        await this.revokeShare(sharedMeter);
      },
    });
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
      header: this.translations.meter_confirmDelete_header(),
      message: this.translations.meter_confirmDelete_message(),
      confirmCallback: async (): Promise<void> => {
        await this.deleteMeter();
      },
    });
  }

  private async revokeShare(sharedMeter: MeterShare): Promise<void> {
    if (sharedMeter && sharedMeter.userId && this.existingMeter?.id) {
      const succeeded = await this.dataStore.revokeMeterShare(
        this.existingMeter.id,
        sharedMeter.userId
      );
      if (succeeded) {
        this.refreshSharedMeter();
      }
    }
  }

  private async deleteMeter(): Promise<void> {
    const meterId = this.existingMeter?.id;
    if (!meterId) {
      this.toastService.add({
        severity: ToastSeverity.Error,
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

    this.shareUsername = undefined;
    this.sharedMeters.set([]);
  }

  private async addMeter(userId: number): Promise<void> {
    const successfulAdded = await this.dataStore.addMeter({
      userId: userId,
      meterNumber: this.meterNumber ?? null,
      location: this.location,
      type: this.type,
      addition: this.addition,
    });
    this.loading.set(false);
    if (successfulAdded) {
      this.dialogVisible.set(false);
    }
  }

  private async editMeter(): Promise<void> {
    const meter = this.existingMeter;
    if (!meter) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.error(),
        detail: this.translations.meter_error_determine(),
      });
      this.loading.set(false);
      return;
    }

    const successfulUpdated = await this.dataStore.updateMeter({
      id: meter.id,
      userId: meter.userId ?? -1,
      meterNumber: this.meterNumber ?? null,
      location: this.location,
      type: this.type,
      addition: this.addition,
    });
    this.loading.set(false);
    if (successfulUpdated) {
      this.dialogVisible.set(false);
    }
  }
}
