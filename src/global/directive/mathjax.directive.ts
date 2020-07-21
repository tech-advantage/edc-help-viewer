import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Doc } from '../../app/documentations/documentation';

declare const MathJax: {
  Hub: {
    Queue: (param: Object[]) => void;
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

  ngOnInit() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]);
  }

  applyMathJax() {
    setTimeout(() => MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.element.nativeElement]));
  }
}
