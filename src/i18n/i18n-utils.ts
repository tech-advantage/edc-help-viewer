// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;
import { chain, flatMap, isObject, split, toString } from 'lodash';

export class I18NUtils {
  /**
   * Returns an array of all keys in JSON file.
   * @param data the orgignal JSON file to flatten.
   * @param prefixe leave default value.
   * @returns {TResult[]} the array of json keys.
   */
  static flatten(data: unknown[], prefixe = ''): string[] {
    return flatMap(data, (val, key) => {
      const newPrefixe = prefixe ? `${prefixe}.${key}` : toString(key);
      if (!isObject(val)) {
        return newPrefixe;
      } else {
        return this.flatten(val as unknown[], newPrefixe);
      }
    });
  }

  /**
   * Returns an array of all i18n JSON file names.
   * @returns i18n filenames.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getI18nFiles(): any {
    return chain(window.__json__)
      .pickBy((file, path) => path.indexOf('i18n') > -1)
      .reduce((memo, file, path) => {
        const lang = split(path, '/')[2];
        const fileName = split(path, '/')[3];
        memo[fileName] = memo[fileName] || {};
        memo[fileName][lang] = this.flatten(file);
        return memo;
      }, {})
      .value();
  }
}
