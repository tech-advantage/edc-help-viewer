import { isEmpty } from 'lodash';

import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Doc } from 'app/documentations/documentation';
import { DocumentationsService } from './documentations.service';
import { ConfigService } from '../config.service';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { selectDocumentation } from '../ngrx/selectors/help-selectors';
import { GlobalHelper } from '../../utils/global-helper';
import { WindowRefService } from '../window-ref.service';

@Component({
  selector: 'app-documentations',
  templateUrl: './documentations.component.html',
  styleUrls: ['./documentations.component.less'],
})
export class DocumentationsComponent implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store<AppState>,
    readonly configService: ConfigService,
    private readonly docService: DocumentationsService,
    private readonly windowRefService: WindowRefService
  ) {
    this.handleResponsive(windowRefService.nativeWindow);
  }

  sub: Subscription;
  documentation: Doc;
  glossaryId: number;
  showSidebar: boolean;
  overlayMode: boolean;
  displayFirstDocInsteadOfToc;

  @ViewChild('linksBar', { read: ElementRef })
  linksBar: ElementRef;

  handleResponsive(window: Window): void {
    const mobileMode = GlobalHelper.isMobile(window, false);
    this.overlayMode = mobileMode;
    this.showSidebar = !mobileMode;
  }

  /* Handle close on click outside when overlayMode is enabled */
  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    /**
     * Only runs when in overlay mode and clicked element is in sidebar container
     */
    if (this.overlayMode && this.showSidebar && this.linksBar && !this.linksBar.nativeElement.contains(e.target)) {
      this.setPanel(false);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.handleResponsive(event.target as Window);
  }

  ngOnInit(): void {
    this.displayFirstDocInsteadOfToc = this.configService.getConfiguration().displayFirstDocInsteadOfToc;
    this.sub = this.store
      .select(selectDocumentation)
      .pipe(switchMap((doc) => this.getFirstDoc(doc)))
      .subscribe((documentation: Doc) => {
        // Since html pipe is pure, need to create new doc object to trigger content refresh
        this.documentation = Object.assign(new Doc(), documentation);
      });
  }

  ngOnDestroy(): void {
    GlobalHelper.unsubscribe(this.sub);
  }

  showLinksbar(): boolean {
    return this.documentation && (!isEmpty(this.documentation.links) || !isEmpty(this.documentation.articles));
  }

  showGlossary(event: number): void {
    this.glossaryId = event;
  }

  setPanel(newVal: boolean): void {
    this.showSidebar = newVal;
  }

  togglePanel(): void {
    this.setPanel(!this.showSidebar);
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
    return this.docService
      .getDocumentation(firstDoc.id)
      .pipe(map((res) => (res ? Object.assign(new Doc(), res.doc) : null)));
  }

  private findFirstDoc(doc) {
    return doc.topics && doc.topics.length ? this.findFirstDoc(doc.topics[0]) : doc;
  }
}
