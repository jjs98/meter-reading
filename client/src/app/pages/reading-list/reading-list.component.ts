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
import FileSaver from 'file-saver';
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

  protected valuesCount = signal('12');
  protected readonly valuesCountOptions = ['6', '12', '24', 'max'];
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
      labels:
        this.valuesCount() === 'max' || Number(this.valuesCount()) >= labels.length
          ? labels.reverse()
          : labels.reverse().slice(labels.length - Number(this.valuesCount()), labels.length),
      datasets: [
        {
          label: 'Readings',
          data:
            this.valuesCount() === 'max' || Number(this.valuesCount()) >= deltaData.length
              ? deltaData
              : deltaData.slice(deltaData.length - Number(this.valuesCount()), deltaData.length),
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
    scales: {
      y: {
        beginAtZero: false,
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

  protected exportExcel(): void {
    import('xlsx').then(xlsx => {
      const readings = this.dataStore.readings().map(reading => {
        return {
          Datum: new Date(reading.readingDate).toLocaleDateString(),
          Zählerstand: reading.number,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(readings);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      let meter = this.dataStore.meters().find(meter => meter.id === this.meterId());
      if (!meter) {
        meter = this.dataStore.sharedMeters().find(meter => meter.id === this.meterId());
      }
      let fileName = meter?.location ?? 'Zähler';
      fileName += meter?.addition ? `_${meter?.addition}` : '';
      if (meter?.type !== undefined) {
        switch (meter.type) {
          case 0:
            fileName += '_Strom';
            break;
          case 1:
            fileName += '_Wasser';
            break;
          case 2:
            fileName += '_Gas';
            break;
        }
      }
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, `${fileName}_${new Date().toLocaleDateString()}${EXCEL_EXTENSION}`);
  }
}
