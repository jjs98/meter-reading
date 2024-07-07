import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

import { DataStore } from './../../store/data.store';
import { Meter } from '../../api/models';
import { MeterType } from '../../models/MeterType.enum';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    FloatLabelModule,
    FormsModule,
    RadioButtonModule,
    TableModule,
  ],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected location: string | undefined = undefined;
  protected meterNumber: string | undefined = undefined;
  protected comment: string | undefined = undefined;
  protected type: MeterType | undefined = undefined;

  protected dialogVisible = signal(false);
  // private dialog = viewChild.required<DialogComponent>()

  public async ngOnInit(): Promise<void> {
    await this.dataStore.refreshMeters();
  }

  protected showDialog(): void {
    this.dialogVisible.set(true);
  }

  protected onRowSelect($event: TableRowSelectEvent): void {
    const selectedMeter = $event.data as Meter;
    if (!selectedMeter.id) {
      return;
    }
    this.router.navigate([`${selectedMeter.id}`], {
      relativeTo: this.activatedRoute,
    });
  }

  protected onCancel(): void {
    this.resetDialog();
  }

  protected async onSave(): Promise<void> {
    const successfulAdded = await this.dataStore.addMeter({
      userId: 1,
      meterNumber: '1234',
      location: 'OG',
      type: MeterType.Electricity,
    });
    if (successfulAdded) {
      this.resetDialog();
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
    this.dialogVisible.set(false);
    this.location = undefined;
    this.meterNumber = undefined;
    this.comment = undefined;
    this.type = undefined;
  }
}
