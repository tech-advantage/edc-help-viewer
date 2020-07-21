import { Pipe, PipeTransform } from '@angular/core';
import { chain } from 'lodash';
import { PathLocationStrategy } from '@angular/common';

@Pipe({
  name: 'anchor',
})
export class AnchorPipe implements PipeTransform {
  path: string;

  constructor(location: PathLocationStrategy) {
    this.path = location.path();
  }

  transform(html: string): string {
    if (html) {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(html, 'text/html');

      // Get all anchor links and update URL (href tag).
      chain(htmlDoc.getElementsByTagName('a'))
        .filter(
          (anchorLink: HTMLAnchorElement) =>
            anchorLink.getAttribute('href') && anchorLink.getAttribute('href').startsWith('#')
        )
        .forEach((anchorLink: HTMLAnchorElement) =>
          anchorLink.setAttribute('href', `${this.path}${anchorLink.getAttribute('href')}`)
        )
        .value();

      return htmlDoc.body.innerHTML;
    } else {
      return '';
    }
  }
}
