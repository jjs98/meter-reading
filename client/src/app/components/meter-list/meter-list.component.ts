import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiMeter } from '../../api/models';
import { MeterClient } from '../../api/clients';

@Component({
  selector: 'app-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
})
export class MeterComponent implements OnInit {
  private meterClient = inject(MeterClient);
  meters = signal<ApiMeter[]>([]);

  ngOnInit() {
    this.refreshMeters();
  }

  addMeter() {
    this.meterClient
      .postMeter({ name: 'New Meter', description: 'test', location: 'home' })
      .then(() => {
        this.refreshMeters();
      });
  }

  refreshMeters() {
    this.meterClient.getMeter().then((meter) => {
      meter.json().then((meter: ApiMeter[]) => {
        this.meters.set(meter);
      });
    });
  }
}
