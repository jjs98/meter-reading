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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule, TableRowSelectEvent } from 'primeng/table';

import { DataStore } from './../../store/data.store';
import { Meter } from '../../api/models';
import { NewMeterDialogComponent } from '../../components/new-meter-dialog/new-meter-dialog.component';

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
    NewMeterDialogComponent,
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

  protected dialogVisible = signal(false);
  private readonly dialog = viewChild.required(NewMeterDialogComponent);

  public async ngOnInit(): Promise<void> {
    await this.dataStore.refreshMeters();
  }

  protected showDialog(): void {
    this.dialog().showDialog();
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
