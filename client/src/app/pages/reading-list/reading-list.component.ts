import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
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
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';

import { Reading } from '../../api/models';
import { ReadingDialogComponent } from '../../components/reading-dialog/reading-dialog.component';
import { NavigationService } from '../../services/navigation.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-reading-list',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    ReadingDialogComponent,
    TableModule,
  ],
  templateUrl: './reading-list.component.html',
  styleUrl: './reading-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingListComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  private readonly navigationService = inject(NavigationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly newDialog = viewChild.required(ReadingDialogComponent);
  private readonly editDialog = viewChild.required(ReadingDialogComponent);

  public meterId = signal(-1);

  public async ngOnInit(): Promise<void> {
    registerLocaleData(de);
    const meterId = this.activatedRoute.snapshot.url[0].path;
    this.meterId.set(Number(meterId));
    await this.dataStore.refreshReadings(this.meterId());
  }

  protected showNewDialog(): void {
    this.newDialog().showDialog();
  }

  protected showEditDialog(reading: Reading): void {
    this.editDialog().showDialog(reading);
  }

  protected navigateBack(): void {
    this.navigationService.navigateBack();
  }
}
