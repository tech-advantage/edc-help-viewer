import { difference, each, size, toString } from 'lodash';
import { I18NUtils } from './i18n-utils';

describe('i18n', () => {
  const i18nFiles = I18NUtils.getI18nFiles();
  each(i18nFiles, (langList, fileName) => {
    describe(toString(fileName), () => {
      each(langList, (file, lang) => {
        each(langList, (fileToTest, langToTest) => {
          if (lang !== langToTest) {
            it(`should ${langToTest} contain all key in ${lang}`, () => {
              const res = difference(file, fileToTest);
              if (size(res)) {
                fail(`missing keys : ${JSON.stringify(res)}`);
              }
            });
          }
        });
      });
    });
  });
});
