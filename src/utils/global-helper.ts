import { cloneDeep, deburr, forEach, isArray, isUndefined, toLower, trim } from 'lodash';

import { Subscription, noop } from 'rxjs';

/**
 * converts a string to basic latin letters and to lower case
 * @param value the string to modify
 * @return {string} the converted string
 */
export function lowerDeburr(value: string): string {
  return toLower(deburr(value));
}

/**
 * removes spaces at the beginning and end of the given string and sets all characters to lower case
 * @param value the string to modify
 * @return {string} the cleaned string
 */
export function trimAndLower(value: string): string {
  return trim(toLower(value));
}


/**
 * Unsubscribe a single or an array of subscriptions.
 * @param subs a subscription, or an array of subscriptions.
 */
export function unsubscribe(subs: Subscription | Subscription[]) {
  if (isUndefined(subs)) {
    return;
  }
  if (isArray(subs)) {
    forEach(subs, sub => sub && !sub.closed ? sub.unsubscribe() : noop);
  } else {
    subs.unsubscribe();
  }
}

export function getNestedMatches(list: any, nestedProp: string, matchProp: string): any {
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

export function isEmpty(arrayToCheck: any): boolean {
  return !arrayToCheck || !arrayToCheck.length;
}
