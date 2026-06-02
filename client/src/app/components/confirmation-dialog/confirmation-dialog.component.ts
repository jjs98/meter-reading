import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TooltipDirective } from '../../directives/tooltip.directive';
import { ConfirmationService } from '../../services/confirmation.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  protected readonly translations = inject(TranslateService).translations;
  protected readonly confirmationService = inject(ConfirmationService);

  protected cancel(): void {
    this.confirmationService.confirmation().cancelCallback?.();
    this.confirmationService.close();
  }

  protected confirm(): void {
    this.confirmationService.confirmation().confirmCallback?.();
    this.confirmationService.close();
  }
}
