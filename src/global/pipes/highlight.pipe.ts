import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {}

  transform(text: string, search: string, onContent: boolean): SafeHtml {
    if (search && text) {
      if (!onContent) {
        let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern
          .split(' ')
          .filter((t) => t.length > 0)
          .join('|');
        const regex = new RegExp(pattern, 'gi');

        return this.sanitizer.bypassSecurityTrustHtml(
          text.replace(regex, (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`)
        );
      } else {
        const regex = new RegExp('(' + search + ')(?!([^<]+)?>)', 'gi');
        return search.length > 3
          ? text.replace(regex, (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`)
          : text;
      }
    } else {
      return text;
    }
  }
}
