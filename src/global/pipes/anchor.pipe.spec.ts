import { AnchorPipe } from './anchor.pipe';
import { PathLocationStrategy } from '@angular/common';

describe('Anchor pipe test', () => {

  const fakePath = 'http://test.com/';

  let anchorPipe: AnchorPipe;
  let location: PathLocationStrategy;

  class MockLocationStrategy {
    path() {}
  }

  beforeEach(() => {
    location = new MockLocationStrategy() as PathLocationStrategy;
    spyOn(location, 'path').and.returnValue(fakePath);
    anchorPipe = new AnchorPipe(location);
  });


  describe('runtime', () => {

    it('should transform a href', () => {
      // Given : a page with several type of "a" tag.
      const htmlPage = `<div><a href=#END></a><a href='http://external-link.com/'></a><a></a></div>`;

      // When : using pipe.
      const result = anchorPipe.transform(htmlPage);

      // Then : the "a" tag referencing anchor link has been modified; not the other "a" tags.
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(result, 'text/html');
      const aTags: any = htmlDoc.body.getElementsByTagName('a');
      expect(aTags.item(0).toString()).toEqual(`${fakePath}#END`);
      expect(aTags.item(1).toString()).toEqual('http://external-link.com/');
      expect(aTags.item(2).toString()).toEqual('');
    });
  });

});
