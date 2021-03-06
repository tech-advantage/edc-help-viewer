import { get, filter, forEach, isEmpty, size } from 'lodash';
import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';
import { SearchDocResult } from './search-doc-result';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TypeDocumentation } from '../../documentations/type-documentation';
import { SearchUtils } from '../../../utils/search.utils';
import { HelpInformationMap } from 'global/classes/help-information-map';
import { HelpDocumentation } from 'global/classes/help-documentation';
import { TranslateConfig } from '../../../global/config/translate.config';

@Injectable()
export class SearchDocService {
  private readonly baseURL = '/httpd/api/search';

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpClient,
    private readonly translateConfig: TranslateConfig
  ) {}

  /**
   * Get the list of documentations by text search.
   * @param search the text to search (mandatory).
   * @param toc the table of contents
   * @return the list of matching documentations, or an empty list if invalid parameters.
   */
  getDocumentationsByText(search: string, informationMaps?: HelpInformationMap[]): Observable<SearchDocResult[]> {
    if (!search || size(search) < 3) {
      return of([]);
    }
    return this.configService.useHttpdServer()
      ? this.findFromServer(search)
      : this.findFromToc(search, informationMaps);
  }

  findFromServer(search: string): Observable<SearchDocResult[]> {
    const params: HttpParams = new HttpParams().set('query', search);
    return this.http.get<SearchDocResult[]>(this.baseURL, { params });
  }

  findFromToc(search: string, informationMaps: HelpInformationMap[]): Observable<SearchDocResult[]> {
    if (!search || isEmpty(informationMaps)) {
      return of([]);
    }
    const results: SearchDocResult[] = [];

    forEach(informationMaps, (informationMap: HelpInformationMap) =>
      this.populateResults(search, informationMap.topics, informationMap, results)
    );
    return of(results);
  }

  populateResults(
    search: string,
    docs: HelpDocumentation[],
    infoMap: HelpInformationMap,
    results: SearchDocResult[]
  ): void {
    filter(docs, (doc: HelpDocumentation) => {
      this.populateResults(search, doc.topics, infoMap, results);
      return SearchUtils.filterString(doc.label, search);
    }).forEach((doc) => {
      // Only doc add to results if documentation type is Chapter or Documentation - avoid information maps content
      if (get(doc, 'type') === TypeDocumentation.CHAPTER || get(doc, 'type') === TypeDocumentation.DOCUMENT) {
        results.push(this.createResult(doc, infoMap));
      }
    });
  }

  createResult(doc: HelpDocumentation, infoMap: HelpInformationMap): SearchDocResult {
    const languageCode = this.translateConfig.getCurrentLang();
    return new SearchDocResult(
      doc.id,
      doc.label,
      infoMap.id,
      infoMap.label,
      languageCode,
      '',
      TypeDocumentation.DOCUMENT
    );
  }
}
