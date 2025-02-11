import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';

import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { NavigationService } from './services/navigation.service';
import { TranslateService } from './services/translate.service';
import { DataStore } from './store/data.store';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ChangePasswordDialogComponent,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputIconModule,
    MenubarModule,
    RouterModule,
    TieredMenuModule,
    ToastModule,
    TooltipModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected readonly dataStore = inject(DataStore);
  protected readonly translationService = inject(TranslateService);
  protected readonly translations = this.translationService.translations;
  private readonly navigationService = inject(NavigationService);

  private readonly changePasswordDialog = viewChild.required(ChangePasswordDialogComponent);

  protected readingDate: Date | undefined = undefined;

  protected items: MenuItem[] = [];

  public ngOnInit(): void {
    this.items = [
      {
        label: 'login_passwordChange',
        command: (): void => {
          this.changePasswordDialog().showDialog();
        },
      },
    ];
  }

  protected logOff(): void {
    this.dataStore.deleteToken();
    this.navigationService.navigateToLogin();
  }
}
