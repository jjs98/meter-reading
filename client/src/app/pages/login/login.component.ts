import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AuthService } from './../../api/services/auth.service';
import { NavigationService } from './../../services/navigation.service';
import { DataStore } from './../../store/data.store';
import { TokenDto } from '../../api/models';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  protected username = '';
  protected password = '';

  protected visible = signal(false);
  protected loading = signal(false);

  public ngOnInit(): void {
    if (this.dataStore.isTokenValid()) {
      this.navigationService.navigateToHome();
      return;
    }
    this.visible.set(true);
  }

  protected async login(): Promise<void> {
    this.loading.set(true);
    const response = await this.authService.postApiAuthLogin({
      body: {
        username: this.username,
        password: this.password,
      },
    });

    if (response.status === 200) {
      const token = response.body as TokenDto;
      if (token.token !== undefined || token.token !== '' || token.token !== null) {
        this.dataStore.setTokenString(token.token ?? undefined);
        const returnUrl = this.navigationService.getReturnUrl();

        if (returnUrl) {
          this.navigationService.navigateTo(returnUrl);
          this.visible.set(false);
          this.loading.set(false);
          return;
        }

        this.navigationService.navigateToHome();
        this.visible.set(false);
        this.loading.set(false);
        return;
      }
    }
    this.loading.set(false);
    this.messageService.add({
      severity: 'error',
      summary: this.translations.login_loginFailed(),
      detail: this.translations.login_loginInvalid(),
    });
  }

  protected async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter' && this.username !== '' && this.password !== '') {
      await this.login();
    }
  }
}
