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
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../api/services';
import { TranslateService } from '../../services/translate.service';
import { DataStore } from '../../store/data.store';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    RadioButtonModule,
    TooltipModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordDialogComponent {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;

  protected oldPassword = '';
  protected newPassword = '';
  protected repeatNewPassword = '';
  protected repeatNewPasswordValid = true;
  protected oldPasswordValid = true;

  protected dialogVisible = signal(false);
  protected loading = signal(false);

  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

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

    this.repeatNewPasswordValid = true;
    this.oldPasswordValid = true;

    if (this.newPassword !== this.repeatNewPassword) {
      this.toastService.add({
        severity: ToastSeverity.Error,
        summary: this.translations.login_passwordChangeFailed(),
        detail: this.translations.login_passwordRepeatInvalid(),
      });
      this.loading.set(false);
      this.repeatNewPasswordValid = false;
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
    this.oldPasswordValid = false;
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
    this.repeatNewPasswordValid = true;
    this.oldPasswordValid = true;
  }
}
