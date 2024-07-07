import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from './../../api/services/auth.service';
import { NavigationService } from './../../services/navigation.service';
import { TokenService } from './../../services/token.service';
import { TokenDto } from '../../api/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly messageService = inject(MessageService);

  protected username = '';
  protected password = '';

  protected visible = signal(false);

  public ngOnInit(): void {
    if (this.tokenService.isTokenValid()) {
      this.navigationService.navigateToHome();
      return;
    }
    this.visible.set(true);
  }

  protected async login() {
    const response = await this.authService.postApiAuthLogin({
      body: {
        username: this.username,
        password: this.password,
      },
    });

    if (response.status === 200) {
      const token = response.body as TokenDto;
      if (token.token !== undefined || token.token !== '' || token.token !== null) {
        this.tokenService.setToken(token.token ?? undefined);
        const returnUrl = this.navigationService.getReturnUrl();

        if (returnUrl) {
          this.navigationService.navigateTo(returnUrl);
          this.visible.set(false);
          return;
        }

        this.navigationService.navigateToHome();
        this.visible.set(false);
        return;
      }
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Invalid username or password',
    });
  }

  protected async onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.username !== '' && this.password !== '') {
      await this.login();
    }
  }
}
