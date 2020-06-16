import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { findIndex, isNumber, toNumber } from 'lodash';

// The CSS class name : see 'classes.less'.
const className = 'doc-selected';

// The enum for arrow direction.
enum Direction { UP, DOWN }

const DirectionKey = {
  38: Direction.UP,
  40: Direction.DOWN
};

@Directive({
  selector: '[keyboardSelect]'
})
export class KeyboardSelectDirective {

  // Notify the validation of the selection.
  @Output() select = new EventEmitter<number>();

  // The current selected element.
  current: HTMLElement;

  constructor(private readonly ul: ElementRef, private readonly rendered: Renderer2) {
  }

  /**
   * On mouse over, override selection with the element with the hover.
   */
  @HostListener('mouseover', ['$event'])
  onMouseOver($event: MouseEvent): void {
    const targetTest = $event.target || $event.srcElement;
    if (targetTest && targetTest instanceof HTMLLIElement) {
      this.clearSelection();
      this.setSelection(targetTest);
    }
  }

  /**
   * Emits selection on "Enter" key.
   */
  @HostListener('document:keydown.enter')
  onEnter(): void {
    if (this.current && this.current.id && isNumber(toNumber(this.current.id))) {
      this.select.emit(toNumber(this.current.id));
    } else {
      this.select.emit(-1); // send -1 to indicate element is the "more result" and not a documentation.
      const elements: HTMLElement[] = this.ul.nativeElement.querySelectorAll('li');
      if (elements && elements.length >= 2) {
        const lastDocumentation = elements[elements.length - 2];
        this.clearSelection();
        this.setSelection(lastDocumentation);
      }
    }
  }

  /**
   * On arrow UP or DOWN, moves selection, and scroll to selection.
   */
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler($event: KeyboardEvent): void {
    const direction = this.getDirection($event.keyCode);
    if (direction != null) { // ignore other keys of keyboard (only arrows up and down).
      const elements: HTMLElement[] = this.ul.nativeElement.querySelectorAll('li');
      if (this.current) {
        this.moveToNextOrPrevious(elements, direction);
      } else {
        this.setSelection(elements[0]);
      }
    }
  }

  /**
   * Move to next or previous element, depending on direction.
   * @param elements the list of all HTML elements
   * @param direction the direction.
   */
  private moveToNextOrPrevious(elements: HTMLElement[], direction: Direction): void {
    const currentIndex = findIndex(elements, el => el.id === this.current.id);
    const index = direction === Direction.DOWN ? currentIndex + 1 : currentIndex - 1;
    if (elements[index]) {
      this.clearSelection();
      this.setSelection(elements[index]);
      this.current.scrollIntoView(false);
    }
  }

  /**
   * Clear the selected element (if there is one).
   */
  private clearSelection() {
    if (this.current) {
      this.rendered.removeClass(this.current, className);
    }
  }

  /**
   * Sets the selected element.
   * @param element the element to select.
   */
  private setSelection(element: HTMLElement): void {
    this.current = element;
    this.rendered.addClass(this.current, className);
  }

  /**
   * Get the direction (UP or DOWN) from the key code.
   * @param keyCode the key code.
   * @return the direction, UP or DOWN.
   */
  private getDirection(keyCode: number): Direction {
    return DirectionKey[keyCode];
  }
}
