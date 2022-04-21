import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(public sanitizer: DomSanitizer) {}

  transform(text: SafeHtml, search: string, isDocument: boolean): SafeHtml {
    if (!isDocument) {
      if (search && text) {
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
        return text;
      }
    } else {
      if (search && text) {
        const regex = new RegExp('(' + search + ')(?!([^<]+)?>)', 'gi');

        return search.length >= 3
          ? this.sanitizer.bypassSecurityTrustHtml(
              text.changingThisBreaksApplicationSecurity.replace(
                regex,
                (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`
              )
            )
          : text;
      } else {
        return text;
      }
    }
  }
}
