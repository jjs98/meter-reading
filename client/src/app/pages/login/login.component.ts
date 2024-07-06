import { TokenService } from './../../services/token.service';
import { NavigationService } from './../../services/navigation.service';
import { AuthService } from './../../api/services/auth.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TokenDto } from '../../api/models';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private messageService = inject(MessageService);
  public username = '';
  public password = '';

  public visible = signal(false);

  ngOnInit(): void {
    if (this.tokenService.isTokenValid()) {
      this.navigationService.navigateToHome();
      return;
    }
    this.visible.set(true);
  }

  async login() {
    const response = await this.authService.postApiAuthLogin({
      body: {
        username: this.username,
        password: this.password,
      },
    });

    if (response.status === 200) {
      const token = response.body as TokenDto;
      if (
        token.token !== undefined ||
        token.token !== '' ||
        token.token !== null
      ) {
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

  async onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.username !== '' && this.password !== '') {
      await this.login();
    }
  }
}
