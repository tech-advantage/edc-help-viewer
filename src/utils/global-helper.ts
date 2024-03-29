import { cloneDeep, deburr, forEach, isArray, isUndefined, toLower, trim } from 'lodash';

import { Subscription, noop } from 'rxjs';

export class GlobalHelper {
  /**
   * converts a string to basic latin letters and to lower case
   * @param value the string to modify
   * @return {string} the converted string
   */
  public static lowerDeburr(value: string): string {
    return toLower(deburr(value));
  }

  /**
   * removes spaces at the beginning and end of the given string and sets all characters to lower case
   * @param value the string to modify
   * @return {string} the cleaned string
   */
  public static trimAndLower(value: string): string {
    return trim(toLower(value));
  }

  /**
   * Unsubscribe a single or an array of subscriptions.
   * @param subs a subscription, or an array of subscriptions.
   */
  public static unsubscribe(subs: Subscription | Subscription[]): void {
    if (isUndefined(subs)) {
      return;
    }
    if (isArray(subs)) {
      forEach(subs, (sub) => (sub && !sub.closed ? sub.unsubscribe() : noop));
    } else {
      subs.unsubscribe();
    }
  }

  public static getNestedMatches(list: unknown[], nestedProp: string, matchProp: string): unknown {
    const results = [];
    const listToCheck = cloneDeep(list);
    do {
      const currentElemts = cloneDeep(listToCheck);
      currentElemts.forEach((doc) => {
        listToCheck.splice(listToCheck.indexOf(doc));
        listToCheck.push(...doc[nestedProp]);
        if (doc[matchProp]) {
          results.push(doc);
        }
      });
    } while (listToCheck.length);
    return results;
  }

  public static isEmpty(arrayToCheck: unknown[]): boolean {
    return !arrayToCheck || !arrayToCheck.length;
  }

  public static isMobile(window: Window, matchTablet?: boolean): boolean {
    const size = this.getWindowSize(window);
    return size === ScreenSize.XS || size === ScreenSize.SM || (matchTablet ? size === ScreenSize.MD : false);
  }

  /**
   * Get a ScreenSize (same as CSS BootStrap breakpoints) in order to provide
   * a friendly way to know the screen size
   *
   * @param window The window object in which we get the width
   */
  public static getWindowSize(window: Window): ScreenSize {
    let windowSize = ScreenSize.XS;
    if (window.innerWidth >= 1200) {
      windowSize = ScreenSize.XL;
    } else if (window.innerWidth >= 992) {
      windowSize = ScreenSize.LG;
    } else if (window.innerWidth >= 768) {
      windowSize = ScreenSize.MD;
    } else if (window.innerWidth >= 576) {
      windowSize = ScreenSize.SM;
    }
    return windowSize;
  }
}

export enum ScreenSize {
  XS,
  SM,
  MD,
  LG,
  XL,
}
