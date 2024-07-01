import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterDto } from '../../api/models';
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
  meters = signal<MeterDto[]>([]);

  ngOnInit() {
    this.refreshMeters();
  }

  addMeter() {
    this.meterClient
      .postMeter({ owner: 'Jens', meterNumber: '1234', location: 'OG', type: MeterType.Water})
      .then(() => {
        this.refreshMeters();
      });
  }

  refreshMeters() {
    this.meterClient.getMeter().then((meter) => {
      meter.json().then((meter: MeterDto[]) => {
        this.meters.set(meter);
      });
    });
  }
}
