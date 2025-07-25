import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import FileSaver from 'file-saver';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Meter, Reading } from '../../api/models';
import { ReadingDialogComponent } from '../../components/reading-dialog/reading-dialog.component';
import { NavigationService } from '../../services/navigation.service';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
  }[];
}

@Component({
  selector: 'app-reading-list',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ChartModule,
    CommonModule,
    DialogModule,
    AutoCompleteModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    RadioButtonModule,
    ReadingDialogComponent,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './reading-list.component.html',
  styleUrl: './reading-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingListComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected valuesCount = signal('12');
  protected readonly valuesCountOptions = ['6', '12', '24', 'max'];
  protected meterId = signal(-1);
  protected meter = signal<Meter | undefined>(undefined);
  protected chartData = computed((): ChartData => {
    const labels: string[] = [];
    const data: number[] = [];
    this.dataStore.readings().map((reading): void => {
      labels.push(new Date(reading.readingDate).toLocaleDateString());
      data.push(Number(reading.number ?? 0));
    });

    const deltaData = data.reverse().map((value, index): number => {
      if (index === 0) {
        return 0;
      }
      return value - data[index - 1];
    });

    return {
      labels:
        this.valuesCount() === 'max' ||
        Number(this.valuesCount()) >= labels.length
          ? labels.reverse().slice(1, labels.length)
          : labels
              .reverse()
              .slice(labels.length - Number(this.valuesCount()), labels.length),
      datasets: [
        {
          label: this.translations.reading_difference(),
          data:
            this.valuesCount() === 'max' ||
            Number(this.valuesCount()) >= deltaData.length
              ? deltaData.slice(1, deltaData.length)
              : deltaData.slice(
                  deltaData.length - Number(this.valuesCount()),
                  deltaData.length
                ),
          fill: false,
          borderColor: getComputedStyle(
            document.documentElement
          ).getPropertyValue('--primary-color'),
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

  private readonly navigationService = inject(NavigationService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly newDialog = viewChild.required(ReadingDialogComponent);
  private readonly editDialog = viewChild.required(ReadingDialogComponent);

  public async ngOnInit(): Promise<void> {
    registerLocaleData(de);
    const meterId = this.activatedRoute.snapshot.url[0].path;
    this.meterId.set(Number(meterId));
    await this.dataStore.refreshReadings(this.meterId());

    const meter = this.dataStore.meters().find((meter): boolean => {
      return meter.id === this.meterId();
    });
    if (!meter) {
      this.meter.set(
        this.dataStore.sharedMeters().find((meter): boolean => {
          return meter.meter.id === this.meterId();
        })?.meter
      );
    } else {
      this.meter.set(meter);
    }
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
    import('xlsx').then((xlsx): void => {
      const readings = this.dataStore
        .readings()
        .map((reading): { Datum: string; Zählerstand: string | undefined } => {
          return {
            Datum: new Date(reading.readingDate).toLocaleDateString('de-DE', {
              dateStyle: 'medium',
            }),
            Zählerstand: reading.number?.toString().replace('.', ','),
          };
        });
      const worksheet = xlsx.utils.json_to_sheet(readings);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const meter = this.meter();
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
    FileSaver.saveAs(
      data,
      `${fileName}_${new Date().toLocaleDateString()}${EXCEL_EXTENSION}`
    );
  }
}
