import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Meter } from '../../api/models';
import { MeterDialogComponent } from '../../components/meter-dialog/meter-dialog.component';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';
import { SharedMeter } from '../../store/features/shared-meters.feature';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    MeterDialogComponent,
    RadioButtonModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);

  protected dialogVisible = signal(false);
  private readonly newDialog = viewChild.required(MeterDialogComponent);
  private readonly editDialog = viewChild.required(MeterDialogComponent);

  public async ngOnInit(): Promise<void> {
    await this.dataStore.refreshMeters();
    await this.dataStore.refreshSharedMeters();
  }

  protected showNewDialog(): void {
    this.newDialog().showDialog();
  }

  protected showEditDialog(meter: Meter): void {
    this.editDialog().showDialog(meter);
  }

  protected onMeterSelect($event: TableRowSelectEvent): void {
    const selectedMeter = $event.data as Meter;
    this.onRowSelect(selectedMeter.id);
  }

  protected onSharedMeterSelect($event: TableRowSelectEvent): void {
    const selectedMeter = $event.data as SharedMeter;
    this.onRowSelect(selectedMeter.meter.id);
  }

  protected async confirmRevokeShare(sharedMeter: SharedMeter): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.meterShare_confirmDelete_header(),
      message: this.translations.meterShare_confirmDelete_message(),
      icon: 'i-[mdi--alert-circle]',
      acceptButtonStyleClass: 'p-button-danger p-button',
      rejectButtonStyleClass: 'p-button',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.revokeMeterShare(sharedMeter);
      },
      reject: () => {},
    });
  }

  private async revokeMeterShare(sharedMeter: SharedMeter): Promise<void> {
    const meter = sharedMeter.meter;
    const user = this.dataStore.user();
    if (!meter.id || !user?.id) {
      return;
    }
    const succeeded = await this.dataStore.revokeMeterShare(meter.id, user.id);
    if (succeeded) {
      await this.dataStore.refreshSharedMeters();
    }
  }

  private onRowSelect(id: number | undefined): void {
    if (!id) {
      return;
    }

    this.router.navigate([`${id}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
