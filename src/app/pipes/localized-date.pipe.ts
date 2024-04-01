import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: Date | string | undefined, format = 'd MMMM, y') {
    const datePipe = new DatePipe(this.translationService.getActiveFullLang());
    return datePipe.transform(value, format);
  }
}
