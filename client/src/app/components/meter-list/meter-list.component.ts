import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meter } from '../../api/models';
import { MeterClient } from '../../api/clients';
import { MeterType } from '../../models/MeterType.enum';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
})
export class MeterComponent implements OnInit {
  private meterClient = inject(MeterClient);
  meters = signal<Meter[]>([]);

  ngOnInit() {
    this.refreshMeters();
  }

  addMeter() {
    // This is temp
    this.meterClient.options = {
      ...this.meterClient.options,
      headers: {
        ...this.meterClient.options.headers,
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    };

    this.meterClient
      .postApiMeter({
        userId: 1,
        meterNumber: '1234',
        location: 'OG',
        type: MeterType.Water,
      })
      .then(() => {
        this.refreshMeters();
      });
  }

  refreshMeters() {
    this.meterClient.getApiMeter().then((meter) => {
      meter.json().then((meter: Meter[]) => {
        this.meters.set(meter);
      });
    });
  }
}
