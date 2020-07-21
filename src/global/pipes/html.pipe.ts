import { Pipe, PipeTransform } from '@angular/core';
import { find, isString, some, chain } from 'lodash';
import { Doc } from '../../app/documentations/documentation';
import { onSrcError } from '../../utils/html-helper';
import { ConfigService } from '../../app/config.service';

@Pipe({
  name: 'html',
})
export class HtmlPipe implements PipeTransform {
  constructor(private readonly configService: ConfigService) {}

  transform(documentation: Doc): string {
    if (!documentation || !documentation.content) {
      return '';
    }

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(documentation.content, 'text/html');

    // Get images and update URL (src tag).
    const docUrl = documentation.url || '';
    chain(htmlDoc.getElementsByTagName('img'))
      .forEach((imgLink: HTMLImageElement) => this.changeImgSrc(imgLink, docUrl))
      .value();

    return htmlDoc.body.innerHTML;
  }

  /**
   * gets the Image src from its attributes list and changes its value if it's not an absolute source path
   * if source path is modified, sets old value in onerror attribute to use it as possible fallback
   * @param image the given image
   * @param docUrl the url of the current doc to use for image url rebasing
   */
  changeImgSrc(image: HTMLImageElement, docUrl: string): void {
    const attr = find(image.attributes, (attribute: Attr) => attribute.name === 'src');
    if (attr && isString(attr.value) && !this.isSrcAbsolute(attr.value)) {
      // set the original source path to onerror function as a fallback if modified source path was not valid
      image.setAttribute('onerror', onSrcError(attr.value));
      // then replace source path value
      attr.value = this.getImgUrl(attr.value, docUrl);
    }
  }

  /**
   * checks if image source path is absolute
   * @param src: the given image source
   * @return {boolean} : return true if image source path is absolute, false if not
   */
  isSrcAbsolute(src: string): boolean {
    const protocols = ['http:', 'https:', 'data:', 'ftp:'];
    const cleanedSrc = src.trim().toLowerCase();
    return some(protocols, (prefix) => cleanedSrc.startsWith(prefix));
  }

  /**
   * rebases the source of a given image on top of the given documentation url
   * @param imgSrc: initial image source
   * @param docUrl: documentation url
   * @return {string} the rebased image url
   */
  getImgUrl(imgSrc: string, docUrl: string): string {
    const splitUrl = docUrl.split('/');
    splitUrl.pop();
    const baseUrl = splitUrl.join('/');
    return `${this.configService.getConfiguration().docPath}/${baseUrl}/${imgSrc}`;
  }
}
