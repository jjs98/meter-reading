import { NavigationService } from './../../services/navigation.service';
import { NavbarComponent } from './../../components/navbar/navbar.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meter-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meter-details.component.html',
  styleUrl: './meter-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDetailsComponent {
  private navigationService = inject(NavigationService);

  navigateBack(): void {
    this.navigationService.navigateBack();
  }
}
