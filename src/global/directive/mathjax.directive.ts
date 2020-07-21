import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Doc } from '../../app/documentations/documentation';

declare const MathJax: {
  Hub: {
    Queue: (param: unknown[]) => void;
  };
};

@Directive({
  selector: '[mathJax]',
})
export class MathjaxDirective implements OnInit {
  @Input('mathJax') set onDocumentationChange(doc: Doc) {
    if (doc) {
      this.applyMathJax();
    }
  }

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]);
  }

  applyMathJax(): void {
    setTimeout(() => MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]));
  }
}
