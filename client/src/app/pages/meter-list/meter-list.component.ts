import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

import { DataStore } from './../../store/data.store';
import { Meter } from '../../api/models';
import { MeterService } from '../../api/services';
import { MeterType } from '../../models/MeterType.enum';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [ButtonModule, CommonModule, DropdownModule, TableModule],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  private readonly meterService = inject(MeterService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public async ngOnInit() {
    await this.dataStore.refreshMeters();
  }

  protected async addMeter() {
    await this.dataStore.addMeter({
      userId: 1,
      meterNumber: '1234',
      location: 'OG',
      type: MeterType.Electricity,
    });
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
}
