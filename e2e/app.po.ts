import { browser, element, by, promise } from 'protractor';

export class EdcHelpNg2Page {
  navigateTo(): promise.Promise<unknown> {
    return browser.get('/');
  }

  getParagraphText(): promise.Promise<string> {
    return element(by.css('app-root h1')).getText();
  }
}
