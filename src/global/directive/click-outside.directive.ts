import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Temporary fix to close dropdown on outside click, but keep it open on inside click.
 * Waiting for release of ngx-bootstrap@2.0.0-beta-9 : https://github.com/valor-software/ngx-bootstrap/issues/2635
 */
@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  constructor(private readonly element: ElementRef) {}

  @Output() clickOutside = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event.target'])
  public onClick(clickedElement) {
    const clickedInside = this.element.nativeElement.contains(clickedElement);
    if (!clickedInside) {
      this.clickOutside.emit(true);
    }
  }

  @HostListener('document:keydown.escape')
  onKeydownHandler() {
    this.clickOutside.emit(true);
  }
}
