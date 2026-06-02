import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DaisyUiToasterComponent } from 'daisyui-toaster';

import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { NavigationService } from './services/navigation.service';
import { TranslateService } from './services/translate.service';
import { DataStore } from './store/data.store';

@Component({
  standalone: true,
  imports: [
    ChangePasswordDialogComponent,
    CommonModule,
    ConfirmationDialogComponent,
    RouterModule,
    DaisyUiToasterComponent,
    TooltipDirective,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly navigationService = inject(NavigationService);

  protected readonly changePasswordDialog = viewChild.required(
    ChangePasswordDialogComponent
  );

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected logOff(): void {
    this.dataStore.deleteToken();
    this.navigationService.navigateToLogin();
  }
}
