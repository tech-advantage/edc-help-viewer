import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfigService } from '../../app/config.service';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  flag = 'g';
  highlightStyle = 'style="font-weight: 600; background: #ffff00;"';
  mathJaxRegex = '<.*?class="math-tex".*?>(.*?)</.*?>';
  regex: RegExp;

  constructor(public sanitizer: DomSanitizer, public configService: ConfigService) {}

  transform(text: string, search: string, onContent: boolean): SafeHtml {
    if (text.match(this.mathJaxRegex)) {
      setTimeout(() => MathJax.Hub.Typeset(text, null), 200);
    }
    if (search && text) {
      if (!onContent) {
        let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern
          .split(' ')
          .filter((t) => t.length > 0)
          .join('|');

        this.configService.useMatchCase() ? this.flag : (this.flag = 'gi');

        this.regex = new RegExp(pattern, this.flag);

        return this.sanitizer.bypassSecurityTrustHtml(
          text.replace(this.regex, (match) => `<span ${this.highlightStyle}>${match}</span>`)
        );
      } else {
        search = '(' + search + ')';
        this.configService.useMatchCase() ? this.flag : (this.flag = 'gi');
        this.configService.useMatchWholeWord() ? (search = '(\\b)' + search + '(\\b)') : search;

        if (text.match(this.mathJaxRegex)) {
          this.regex = new RegExp('(' + search + ')(?!([^<]+)?>)(?!(.(?!<span class="math-tex"))*</span>)', this.flag);
        } else {
          this.regex = new RegExp('(' + search + ')(?!([^<]+)?>)', this.flag);
        }
        return search.length >= 1
          ? text.replace(this.regex, (match) => `<span ${this.highlightStyle}>${match}</span>`)
          : text;
      }
    } else {
      return text;
    }
  }
}
