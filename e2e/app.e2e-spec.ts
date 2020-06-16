import { EdcHelpNg2Page } from './app.po';

describe('edc-help-ng2 App', function() {
  let page: EdcHelpNg2Page;

  beforeEach(() => {
    page = new EdcHelpNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
