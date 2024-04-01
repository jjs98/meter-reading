import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';
import { TranslationService } from '../../services/translation.service';
import { DatePipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

interface Meter {
  id: number;
  name: string;
  value: number;
  lastUpdate?: Date;
}

@Component({
  selector: 'app-meter-list',
  standalone: true,
  imports: [TranslocoPipe, ClarityModule, LocalizedDatePipe],
  templateUrl: './meter-list.component.html',
  styleUrl: './meter-list.component.scss',
})
export class MeterListComponent {
  public meters: Meter[] = [
    { id: 1, name: 'Wasser - Keller', value: 25.93, lastUpdate: new Date(2024, 3, 23) },
    { id: 2, name: 'Wasser', value: 21.93, lastUpdate: new Date(2024, 4, 1) },
    { id: 3, name: 'Strom', value: 30.93, lastUpdate: new Date(2024, 2, 12) },
  ];

  public getLocalizedDate(date: Date | undefined) {
    const datePipe = new DatePipe(this.translationService.getActiveFullLang());
    return datePipe.transform(date, 'd MMM, y');
  }

  constructor(private translationService: TranslationService) { }
}
