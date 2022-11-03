import { find } from 'lodash';
import { HtmlPipe } from './html.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Doc } from '../../app/documentations/documentation';
import { mock, mockService } from '../../utils/test-helpers';
import { onSrcError } from '../../utils/html-helper';
import { ConfigService } from '../../app/config.service';

describe('Html pipe test', () => {
  let htmlPipe: HtmlPipe;
  let configService: ConfigService;

  let docUrl: string;
  let docPath: string;
  let image: HTMLImageElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HtmlPipe,
        DomSanitizer,
        mockService(ConfigService, ['getConfiguration']),
        { provide: onSrcError, useValue: () => '' },
      ],
    });

    htmlPipe = TestBed.inject(HtmlPipe);
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getConfiguration').and.returnValue({ docPath: '/doc' });
  });

  beforeEach(() => {
    docUrl = 'html/en/1/23/4.html';
    docPath = '/doc/';
  });

  describe('transform', () => {
    let doc: Doc;

    beforeEach(() => {
      doc = mock(Doc, {
        url: 'html/en/1/23/12.html',
        content: '<html><body><div><img src="img/lighthouse.jpg" style="height:150px" /></div></body></html>',
      });
      const parser = new DOMParser();
      parser.parseFromString(doc.content, 'text/html');
    });

    it('should test transform', () => {
      const result = htmlPipe.transform(doc);
      const url = '/doc/html/en/1/23/img/lighthouse.jpg';
      const onerror = "this.setAttribute('onerror', null);this.setAttribute('src', 'img/lighthouse.jpg');";
      expect(result).toEqual(`<div><img src="${url}" style="height:150px" onerror="${onerror}"></div>`);
    });
  });

  describe('getImgUrl', () => {
    beforeEach(() => {
      image = document.createElement('img');
      image.setAttribute('src', 'img/lighthouse.jpg');
    });

    it('should return the rebased image url', () => {
      const imgSrc = find(image.attributes, (attribute: Attr) => attribute.name === 'src');
      expect(imgSrc.value).toEqual('img/lighthouse.jpg');
      const result = htmlPipe.getImgUrl(imgSrc.value, docUrl);

      expect(result).toEqual('/doc/html/en/1/23/img/lighthouse.jpg');
    });
  });

  describe('changeImgSrc', () => {
    beforeEach(() => {
      image = document.createElement('img');
    });

    it('should set the correct image url and save original source value in onerror attribute', () => {
      // given the original source path
      const originalSrc = '2/3/img.jpg';
      image.setAttribute('src', originalSrc);

      // when changing image source
      htmlPipe.changeImgSrc(image, docUrl);

      // then src attribute should have been set with the doc path
      const srcAttr = find(image.attributes, (attribute: Attr) => attribute.name === 'src');
      expect(srcAttr.value).toEqual(`${docPath}html/en/1/23/2/3/img.jpg`);
      // and onerror should have been set with the originalSrc value
      const onErrorAttr = find(image.attributes, (attribute: Attr) => attribute.name === 'onerror');
      expect(onErrorAttr.value).toEqual(onSrcError(originalSrc));
    });

    it('should not change image source if it s an absolute path', () => {
      // given the original source path
      const originalSrc = 'http://www.abc.com/2/3/img.jpg';
      image.setAttribute('src', originalSrc);

      // when changing image source
      htmlPipe.changeImgSrc(image, docUrl);

      // then src attribute should not have been changed and onerror attribute should be falsy
      const onErrorAttr = find(image.attributes, (attribute: Attr) => attribute.name === 'onerror');
      const srcAttr = find(image.attributes, (attribute: Attr) => attribute.name === 'src');

      expect(srcAttr.value).toEqual(originalSrc);
      expect(onErrorAttr).toBeFalsy();
    });
  });

  describe('test isSrcAbsolute', () => {
    it('should return true if image source path is absolute', () => {
      const imageSrc = '     hTTps://www.site.com/12/myImage.gif   ';

      const result = htmlPipe.isSrcAbsolute(imageSrc);

      expect(result).toBeTruthy();
    });

    it('should return false if image source path is relative', () => {
      const imageSrc = './12/myImage.gif';

      const result = htmlPipe.isSrcAbsolute(imageSrc);

      expect(result).toBeFalsy();
    });
  });
});
