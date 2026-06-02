import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService, ToastSeverity } from 'daisyui-toaster';

import { AuthService } from '../../api/services';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipDirective],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected oldPassword = '';
  protected newPassword = '';
  protected repeatNewPassword = '';
  protected repeatNewPasswordValid = signal(true);
  protected oldPasswordValid = signal(true);

  protected dialogVisible = signal(false);
  protected loading = signal(false);

  public constructor() {
    effect((): void => {
      if (!this.dialogVisible()) {
        this.resetDialog();
      }
    });
  }

  public showDialog(): void {
    this.dialogVisible.set(true);
  }

  protected onCancel(): void {
    this.dialogVisible.set(false);
  }

  protected async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (
      event.key === 'Enter' &&
      this.oldPassword &&
      this.newPassword &&
      this.repeatNewPassword
    ) {
      await this.changePassword();
    }
  }

  protected async changePassword(): Promise<void> {
    this.loading.set(true);

    this.repeatNewPasswordValid.set(true);
    this.oldPasswordValid.set(true);

    if (this.newPassword !== this.repeatNewPassword) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.login_passwordChangeFailed(),
        detail: this.translations.login_passwordRepeatInvalid(),
      });
      this.loading.set(false);
      this.repeatNewPasswordValid.set(false);
      return;
    }

    const response = await this.authService.changePasswordEndpoint({
      body: {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      },
    });

    if (response.status === 200) {
      this.toastService.add({
        severity: ToastSeverity.Success,
        summary: this.translations.success(),
        detail: this.translations.login_passwordChangeSuccess(),
      });
      this.dialogVisible.set(false);
      this.loading.set(false);
      return;
    }
    this.oldPasswordValid.set(false);
    this.loading.set(false);
    this.toastService.add({
      severity: ToastSeverity.Error,
      summary: this.translations.login_passwordChangeFailed(),
      detail: this.translations.login_passwordChangeInvalid(),
    });
  }

  private resetDialog(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.repeatNewPassword = '';
    this.repeatNewPasswordValid.set(true);
    this.oldPasswordValid.set(true);
  }
}
