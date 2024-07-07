import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NavigationService } from './../../services/navigation.service';

@Component({
  selector: 'app-meter-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meter-details.component.html',
  styleUrl: './meter-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDetailsComponent {
  private readonly navigationService = inject(NavigationService);

  protected navigateBack(): void {
    this.navigationService.navigateBack();
  }
}
