import { chain, get, isNil, toString } from 'lodash';
import { Observable, from, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { HelpService } from 'app/help/help.service';
import { HelpInformationMap } from 'global/classes/help-information-map';
import { Doc } from 'app/documentations/documentation';
import { InformationMap, Toc } from 'edc-client-js';
import { SearchDocResult } from 'app/left-sidebar/search-doc/search-doc-result';

@Injectable()
export class LeftSidebarService {
  constructor(private readonly helpService: HelpService) {}

  getCurrentInformationMap(id: number): Observable<InformationMap> {
    return !isNil(id) ? this.helpService.getInformationMapFromDocId(id) : of(undefined);
  }

  /**
   * Count the number of search results that belong to the information map
   *
   * @param {HelpInformationMap} informationMap the information map to match against
   * @param {SearchDocResult[]} results an array containing the results
   * @return {number}
   */
  countResult(informationMap: HelpInformationMap, results: SearchDocResult[]): number {
    if (!informationMap) {
      return 0;
    }
    const imId = informationMap.id;
    return isNil(imId)
      ? 0
      : chain(results)
          .filter((result) => toString(result.strategyId) === toString(imId))
          .size()
          .valueOf();
  }

  /**
   * Create the help information maps for the left side bar component from the edc-client-js toc
   *
   * @param {Doc} doc the currently active documentation
   * @return {Observable<HelpInformationMap[]>}
   */
  initToc(exportId?: string, langCode?: string): Observable<HelpInformationMap[]> {
    return from(
      this.helpService.getToc(exportId).then(
        (toc: Toc) => this.buildHelpInformationMaps(toc, langCode),
        () => new Array<HelpInformationMap>()
      )
    );
  }

  /**
   * Rebuild Information maps tree objects from the toc sent by edc-client-js
   *
   * @param {} toc the table of content of current open export
   * @return {HelpInformationMap[]}
   */
  buildHelpInformationMaps(toc: Toc, langCode?: string): HelpInformationMap[] {
    const infoMapsSrc: InformationMap[] = get(toc, 'toc') || [];
    return infoMapsSrc.map((iM: InformationMap) => new HelpInformationMap(iM, langCode));
  }
}
