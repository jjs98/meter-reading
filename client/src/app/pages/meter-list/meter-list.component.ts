import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MeterDialogComponent } from '../../components/meter-dialog/meter-dialog.component';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Meter } from '../../models/meter';
import { ConfirmationService } from '../../services/confirmation.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';
import { SharedMeter } from '../../store/features/shared-meters.feature';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule, MeterDialogComponent, TooltipDirective],
  templateUrl: './meter-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);

  private readonly newDialog = viewChild.required(MeterDialogComponent);
  private readonly editDialog = viewChild.required(MeterDialogComponent);

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  protected dialogVisible = signal(false);

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

  protected async confirmRevokeShare(sharedMeter: SharedMeter): Promise<void> {
    this.confirmationService.confirm({
      header: this.translations.meterShare_confirmDelete_header(),
      message: this.translations.meterShare_confirmDelete_message(),
      confirmCallback: async (): Promise<void> => {
        this.revokeMeterShare(sharedMeter);
      },
    });
  }

  protected onRowSelect(id: number | undefined): void {
    if (!id) {
      return;
    }

    this.router.navigate([`${id}`], {
      relativeTo: this.activatedRoute,
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
}
