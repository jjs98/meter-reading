import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ClarityModule, TranslocoPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent { }
