import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meter } from '../../api/models';
import { MeterType } from '../../models/MeterType.enum';
import { MeterService } from '../../api/services';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, DropdownModule],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterComponent implements OnInit {
  private meterService = inject(MeterService);
  meters = signal<Meter[]>([]);

  ngOnInit() {
    this.refreshMeters();
  }

  addMeter() {
    this.meterService
      .postApiMeter({
        body: {
          userId: 1,
          meterNumber: '1234',
          location: 'OG',
          type: MeterType.Electricity,
        },
      })
      .then(() => {
        this.refreshMeters();
      });
  }

  refreshMeters() {
    this.meterService.getApiMeter().then((resonse) => {
      if (resonse.status === 200) {
        const meter = resonse.body as Meter[];
        this.meters.set(meter);
      }
    });
  }
}
