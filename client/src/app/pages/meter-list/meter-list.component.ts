import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meter } from '../../api/models';
import { MeterType } from '../../models/MeterType.enum';
import { MeterService } from '../../api/services';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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

  onRowSelect($event: TableRowSelectEvent): void {
    const selectedMeter = $event.data as Meter;
    if (!selectedMeter.id) {
      return;
    }
    this.router.navigate([`${selectedMeter.id}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
