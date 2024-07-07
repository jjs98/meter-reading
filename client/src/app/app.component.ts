import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

import { NavigationService } from './services/navigation.service';
import { TokenService } from './services/token.service';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    InputIconModule,
    MenubarModule,
    RouterModule,
    ToastModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly tokenService = inject(TokenService);

  public items: MenuItem[] = [
    {
      label: 'Meters',
      icon: 'i-[mdi--counter]',
      routerLink: '/meters',
    },
    {
      label: 'New Reading',
      icon: 'i-[mdi--plus-box]',
      routerLink: '/reading',
    },
  ];

  public ngOnInit(): void {
    this.tokenService.loadToken();
  }

  protected logOff() {
    this.tokenService.deleteToken();
    this.navigationService.navigateToLogin();
  }
}
