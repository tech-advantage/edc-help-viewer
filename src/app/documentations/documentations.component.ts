import {isEmpty} from 'lodash';

import {EMPTY, Observable, of, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Doc} from 'app/documentations/documentation';
import {DocumentationsService} from './documentations.service';
import {ConfigService} from '../config.service';
import {AppState} from '../app.state';
import {Store} from '@ngrx/store';
import {selectDocumentation} from '../ngrx/selectors/help-selectors';
import {isMobile, unsubscribe} from '../../utils/global-helper';
import {WindowRefService} from '../window-ref.service';

@Component({
  selector: 'app-documentations',
  templateUrl: './documentations.component.html',
  styleUrls: ['./documentations.component.less']
})
export class DocumentationsComponent implements OnInit, OnDestroy {
  sub: Subscription;
  documentation: Doc;
  glossaryId: number;
  showSidebar: boolean;
  overlayMode: boolean;

  displayFirstDocInsteadOfToc;
  constructor(private readonly store: Store<AppState>,
              private readonly configService: ConfigService,
              private readonly docService: DocumentationsService,
              private readonly windowRefService: WindowRefService) {
    this.handleResponsive(windowRefService.nativeWindow);
  }

  handleResponsive(window: Window): void {
    const mobileMode = isMobile(window, false);
    this.overlayMode = mobileMode;
    this.showSidebar = !mobileMode;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleResponsive(event.target);
  }

  ngOnInit(): void {
    this.displayFirstDocInsteadOfToc = this.configService.getConfiguration().displayFirstDocInsteadOfToc;
    this.sub = this.store.select(selectDocumentation).pipe(
      switchMap(doc => this.getFirstDoc(doc))
    ).subscribe((documentation: Doc) => {
      // Since html pipe is pure, need to create new doc object to trigger content refresh
      this.documentation = Object.assign(new Doc(), documentation);
    });
  }

  ngOnDestroy(): void {
    unsubscribe(this.sub);
  }

  showLinksbar(): boolean {
    return this.documentation && (!isEmpty(this.documentation.links) || !isEmpty(this.documentation.articles));
  }

  showGlossary(event): void {
    this.glossaryId = event;
  }

  togglePanel() {
    this.showSidebar = !this.showSidebar;
  }

  getFirstDoc(documentation: Doc): Observable<Doc> {
    if (!documentation) {
      return EMPTY;
    }
    const firstDoc = this.displayFirstDocInsteadOfToc ? this.findFirstDoc(documentation) : documentation;
    if (!firstDoc || (!firstDoc.articles && !firstDoc.id)) {
      return EMPTY;
    }
    if (firstDoc.content) {
      return of(firstDoc);
    }
    return this.docService.getDocumentation(firstDoc.id).pipe(
      map(res => res ? Object.assign(new Doc(), res.doc) : null)
    );
  }

  private findFirstDoc(doc) {
    return (doc.topics && doc.topics.length) ? this.findFirstDoc(doc.topics[0]) : doc;
  }
}
