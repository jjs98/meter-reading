import {
  Directive,
  HostBinding,
  HostListener,
  input,
  OnDestroy,
  signal,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  public tooltip = input('');
  public tooltipDelay = input(500);

  @HostBinding('attr.data-tip')
  public get dataTip(): string {
    if (!this.showTooltip()) {
      return '';
    }

    return this.tooltip();
  }

  private showTooltip = signal(false);
  private timeoutId?: ReturnType<typeof setTimeout>;

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.timeoutId = setTimeout((): void => {
      this.showTooltip.set(true);
    }, this.tooltipDelay());
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.clearTimer();
    this.showTooltip.set(false);
  }

  public ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
