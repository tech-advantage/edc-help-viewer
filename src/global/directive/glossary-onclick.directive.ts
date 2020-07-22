import { forEach } from 'lodash';
import { Directive, ElementRef, AfterViewInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';
import { Doc } from '../../app/documentations/documentation';

/**
 * sets their onclick function to all spans referencing glossary elements
 */
@Directive({
  selector: '[glossaryOnclick]',
})
export class GlossaryOnclickDirective implements AfterViewInit {
  @Input('glossaryOnclick') set onDocumentationChange(doc: Doc) {
    if (doc) {
      setTimeout(() => this.ngAfterViewInit());
    }
  }

  @Output() glossaryClicked = new EventEmitter<number>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  el: any; // elementRef.nativeElement type is 'any'

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.el = elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    // retrieve all spans with data-glossary attributes
    const glossaryElements = this.el.querySelectorAll('span[data-glossary]');
    // change their onclick function
    this.addOnclickFunction(glossaryElements);
  }

  addOnclickFunction(glossaryElements: HTMLSpanElement[]): void {
    forEach(glossaryElements, (element: HTMLSpanElement) => {
      // for each glossaryElement, on clicking, emit the glossaryId to open the glossary
      this.renderer.listen(element, 'click', () => {
        const glossaryId = element.getAttribute('data-glossary');
        this.glossaryClicked.emit(+glossaryId);
      });
    });
  }
}
