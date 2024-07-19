import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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
    ChartModule,
    CommonModule,
    DialogModule,
    DropdownModule,
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

  protected valuesCount = signal(10);
  protected readonly valuesCountOptions = [5, 10, 15, 20];
  protected meterId = signal(-1);
  protected chartData = computed(() => {
    const labels: string[] = [];
    const data: number[] = [];
    this.dataStore.readings().map(reading => {
      labels.push(new Date(reading.readingDate).toLocaleDateString());
      data.push(Number(reading.number ?? 0));
    });

    const deltaData = data.reverse().map((value, index) => {
      if (index === 0) {
        return 0;
      }
      return value - data[index - 1];
    });

    return {
      labels: labels.reverse().slice(labels.length - this.valuesCount(), labels.length),
      datasets: [
        {
          label: 'Readings',
          data: deltaData.slice(deltaData.length - this.valuesCount(), deltaData.length),
          fill: false,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue(
            '--primary-color'
          ),
        },
      ],
    };
  });
  protected chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

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
