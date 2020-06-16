import { lowerDeburr } from './global-helper';

/**
 * Utility class for search/filter feature in Configuration components (Product & User management).
 */
export class SearchUtils {

  /**
   * Simple search function (uses "lowerDeburr" for better accuracy : accents, case,... ).
   * @param source the source string we are searching something into.
   * @param search the string to search.
   * @returns {boolean} true if "search" has been found in "source", otherwise false.
   */
  public static filterString(source: string, search: string): boolean {
    const searchText: string = lowerDeburr(search);
    const text: string = lowerDeburr(source);
    return text.indexOf(searchText) > -1;
  }
}
