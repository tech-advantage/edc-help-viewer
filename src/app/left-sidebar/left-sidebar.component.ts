import { EMPTY, from, Observable, of, Subscription } from 'rxjs';
import {
  catchError,
  delay,
  filter,
  first as rxFirst,
  flatMap,
  map as rxMap,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';

import { find, first, forEach, get, isEmpty, isEqual, isNil, last, map, some, toString } from 'lodash';

import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { InformationMap } from 'edc-client-js';
import { GlobalHelper } from '../../utils/global-helper';
import { SearchDocResult } from 'app/left-sidebar/search-doc/search-doc-result';
import { HelpInformationMap } from 'global/classes/help-information-map';
import { HelpDocumentation } from 'global/classes/help-documentation';
import { LeftSidebarService } from 'app/left-sidebar/left-sidebar.service';
import { Doc } from 'app/documentations/documentation';
import { ConfigService } from '../config.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppState, DocState } from '../app.state';
import { selectDocState } from '../ngrx/selectors/help-selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.less'],
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  informationMapList: HelpInformationMap[] = [];
  opened: HelpInformationMap;
  searchResults: SearchDocResult[] = [];
  searchResultIds: number[] = [];
  lang;
  currentDoc: Doc; // The currently open documentation
  currentImId: string; // The information map containing the current doc
  currentExportId: string;
  hasExportChanged: boolean; // True if previously open documentation was from another export

  private collapseTocAsDefault: boolean;

  constructor(
    private readonly element: ElementRef,
    private readonly configService: ConfigService,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly leftSidebarService: LeftSidebarService
  ) {}

  ngOnInit(): void {
    this.subs.push(this.onDocumentationChanged());
    this.collapseTocAsDefault = this.configService.getConfiguration().collapseTocAsDefault;
    this.router.events
      .pipe(
        filter((value) => value instanceof NavigationEnd),
        delay(300)
      )
      .subscribe((val: NavigationEnd) => {
        const childDocID = last(val.urlAfterRedirects.split('/'));
        from(this.informationMapList)
          .pipe(
            flatMap((informationMap) => from(informationMap.topics)),
            filter((doc) => isEqual(doc.id, childDocID) || this.hasChild(doc.topics, childDocID)),
            rxFirst(),
            catchError(() => EMPTY)
          )
          .subscribe((rootDoc) => {
            rootDoc.$isCollapsed = false;
            this.scrollToDoc();
          });
      });
  }

  ngOnDestroy(): void {
    GlobalHelper.unsubscribe(this.subs);
  }

  /**
   * Subscribe to documentation changes
   * When currently open documentation changes, initialize or update the information maps and search contexts
   *
   * @return {Subscription}
   */
  onDocumentationChanged(): Subscription {
    // Listen to changes on current documentation
    return this.store
      .select(selectDocState)
      .pipe(
        filter(Boolean),
        tap((docState: DocState) => (this.lang = docState && docState.documentationLanguage)),
        rxMap((docState: DocState) => this.updateCurrentDoc(docState)), // Save the currentDoc
        switchMap((exportId: string) => this.initInformationMaps(exportId)), // Initialize informationMaps from current Doc
        // Get current information map from current documentation
        switchMap(() => this.leftSidebarService.getCurrentInformationMap(get(this.currentDoc, 'id') as number)),
        tap(() => this.scrollToDoc())
      ) // Center the view of the tree on the current Doc
      .subscribe((informationMap: InformationMap) => this.updateOpenInformationMap(informationMap)); // Save the open information map
  }

  updateCurrentDoc(docState: DocState): string {
    if (!docState) {
      return null;
    }
    const { documentation: doc } = docState;
    this.lang = docState.documentationLanguage;
    this.currentExportId = doc.exportId;
    // Check if the doc we're going to comes from another export
    this.hasExportChanged = this.currentExportId !== docState.exportId;
    this.currentDoc = doc;
    return docState.exportId;
  }

  /**
   * Update current open information map after current documentation changed
   * Will only update if initializing or if information map of newly open documentation changed, after a navigation
   * from the tree or from the search droplist
   *
   * @param {} informationMap the information map of the newly open documentation
   */
  updateOpenInformationMap(informationMap: InformationMap): void {
    // Update only if initializing or if current information map changed
    const informationMapId = get(informationMap, 'id');
    if (isNil(this.currentImId) || toString(informationMapId) !== toString(this.currentImId) || this.hasExportChanged) {
      this.currentImId = informationMapId + '';
      // If no documentation is currently selected, toggle the first information map, else find and open doc information map
      this.opened = isNil(this.currentDoc)
        ? first(this.informationMapList)
        : find(this.informationMapList, (im) => toString(this.currentImId) === toString(im.id));
      this.refreshSearchStatuses();
    }
  }

  /**
   * Scroll to the current doc element in the left tree
   * Uses a 100 ms timeout
   *
   */
  scrollToDoc(): void {
    if (this.currentDoc) {
      setTimeout(() => {
        // Find the element that activated the router
        const elem = this.element.nativeElement.querySelector('.active-link');
        if (elem && typeof elem.scrollIntoView === 'function') {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  initInformationMaps(exportId: string): Observable<HelpInformationMap[]> {
    let informationMapsObs = of(this.informationMapList);
    if (isEmpty(this.informationMapList) || this.hasExportChanged) {
      // If initializing or documentation export has changed, define information maps from new toc
      informationMapsObs = this.leftSidebarService.initToc(exportId, this.lang).pipe(
        flatMap((infoMaps) => from(infoMaps)),
        tap((infoMap) => {
          const rootDocumentation: HelpDocumentation[] = infoMap.topics;
          if (rootDocumentation && rootDocumentation.length) {
            rootDocumentation.forEach((doc: HelpDocumentation) => (doc.$isCollapsed = this.collapseTocAsDefault));
          }
        }),
        toArray(),
        tap((infoMaps) => (this.informationMapList = infoMaps))
      );
    }
    return informationMapsObs;
  }

  /**
   * Toggle strategy : if click on the opened one, close it by setting null, otherwise set it as 'opened'.
   * Refresh documentation search statuses
   *
   * @param informationMap
   */
  toggleIm(informationMap: HelpInformationMap): void {
    this.opened = this.opened === informationMap ? null : informationMap;
    this.refreshSearchStatuses();
    // Scroll to the current doc if any
    if (this.opened) {
      this.scrollToDoc();
    }
  }

  isOpen(informationMap: InformationMap): boolean {
    const openId = get(this.opened, 'id');
    return openId && get(informationMap, 'id') === openId;
  }

  onSearch(results: SearchDocResult[]): void {
    this.searchResults = results;
    this.searchResultIds = map(results, (result) => result.id);
    this.updateResultNumber();
    this.refreshSearchStatuses();
  }

  /**
   * Refresh search results statuses for the currently open information map
   *
   */
  refreshSearchStatuses(): void {
    let topics: HelpDocumentation[];
    if (this.opened) {
      topics = this.opened.topics;
    }
    this.handleSearchMatchingDocs(topics);
    this.handleParentMatchingDocs(topics);
  }

  /**
   * Provides the number of search results for each information map
   *
   */
  updateResultNumber(): void {
    forEach(
      this.informationMapList,
      (infoMap: HelpInformationMap) =>
        (infoMap.$resultsCount = this.leftSidebarService.countResult(infoMap, this.searchResults))
    );
  }

  /**
   * Mark the documentations flag $matchesSearch as true if it matches the search (its id is in the search results ids list)
   *
   * @param {HelpDocumentation[]} docs the documentations contained in the information map
   */
  handleSearchMatchingDocs(docs: HelpDocumentation[]): void {
    forEach(docs, (doc) => {
      // Recursively process doc's children
      this.handleSearchMatchingDocs(doc.topics);
      // Set matchesSearch property value
      doc.$matchesSearch =
        isEmpty(this.searchResultIds) || some(this.searchResultIds, (id) => toString(id) === toString(doc.id));
    });
  }

  /**
   * Mark the documentations flag $isParentSearch as true if it contains a parent or a match of a search result
   *
   * @param {HelpDocumentation[]} docs the documentations contained in the information map
   */
  handleParentMatchingDocs(docs: HelpDocumentation[]): void {
    forEach(docs, (doc) => {
      // Recursively process doc's children
      this.handleParentMatchingDocs(doc.topics);
      // Set parent search property value
      doc.$isParentSearch =
        isEmpty(this.searchResultIds) || some(doc.topics, (child) => child.$matchesSearch || child.$isParentSearch);
    });
  }

  hasChild(docs: HelpDocumentation[], childDocID: string): boolean {
    let found = false;
    if (docs && docs.length) {
      found = some(docs, (doc) => isEqual(doc.id, childDocID));
      if (!found) {
        const array = [];
        forEach(docs, (doc) => array.push(...doc.topics));
        found = this.hasChild(array, childDocID);
      }
    }
    return found;
  }
}
