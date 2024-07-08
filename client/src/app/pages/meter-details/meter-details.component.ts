import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

import { NavigationService } from './../../services/navigation.service';
import { DataStore } from './../../store/data.store';
import { NewReadingDialogComponent } from '../../components/new-reading-dialog/new-reading-dialog.component';

@Component({
  selector: 'app-meter-details',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    NewReadingDialogComponent,
    RadioButtonModule,
    TableModule,
  ],
  templateUrl: './meter-details.component.html',
  styleUrl: './meter-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDetailsComponent implements OnInit {
  public readonly dataStore = inject(DataStore);
  private readonly navigationService = inject(NavigationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly dialog = viewChild.required(NewReadingDialogComponent);

  public meterId = signal(-1);

  public async ngOnInit(): Promise<void> {
    const meterId = this.activatedRoute.snapshot.url[0].path;
    this.meterId.set(Number(meterId));
    await this.dataStore.refreshReadings(this.meterId());
  }

  protected showDialog(): void {
    this.dialog().showDialog();
  }

  protected navigateBack(): void {
    this.navigationService.navigateBack();
  }

  protected async deleteMeter(): Promise<void> {
    const deleted = await this.dataStore.deleteMeter(this.meterId());
    if (deleted) {
      this.messageService.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: 'Record deleted',
      });
      this.navigationService.navigateBack();
    }
  }

  protected async confirmDeleteMeter(event: Event): Promise<void> {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this meter?',
      header: 'Delete Confirmation',
      icon: 'i-[mdi--alert-circle]',
      acceptButtonStyleClass: 'p-button-danger p-button',
      rejectButtonStyleClass: 'p-button',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteMeter();
      },
      reject: () => {},
    });
  }
}
