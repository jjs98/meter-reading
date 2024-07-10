import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';

import { NavigationService } from './services/navigation.service';
import { TranslateService } from './services/translate.service';
import { DataStore } from './store/data.store';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
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
export class AppComponent {
  protected readonly dataStore = inject(DataStore);
  protected readonly translations = inject(TranslateService).translations;
  private readonly navigationService = inject(NavigationService);

  protected logOff(): void {
    this.dataStore.deleteToken();
    this.navigationService.navigateToLogin();
  }
}
