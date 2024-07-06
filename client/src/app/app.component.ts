import { TokenService } from './services/token.service';
import { NavigationService } from './services/navigation.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    MenubarModule,
    ButtonModule,
    InputIconModule,
    FormsModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private tokenService = inject(TokenService);

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

  ngOnInit(): void {
    this.tokenService.loadToken();
  }

  logOff() {
    this.tokenService.deleteToken();
    this.navigationService.navigateToLogin();
  }
}
