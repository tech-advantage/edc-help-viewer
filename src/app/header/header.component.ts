import { Subscription, EMPTY, combineLatest } from 'rxjs';
import { switchMap, debounceTime, catchError } from 'rxjs/operators';

import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { HelpService } from '../help/help.service';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ConfigService } from '../config.service';
import { LeftSideBarSharedService } from '../left-sidebar/left-sidebar-shared.service';
import { environment } from 'environments/environment';
import { AppState } from '../app.state';
import { Store } from '@ngrx/store';
import { selectDocumentationLanguage, selectExportId } from '../ngrx/selectors/help-selectors';
import { unsubscribe } from '../../utils/global-helper';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.less'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  title: string;
  logoUrl: string;
  subs: Subscription[] = [];
  pluginId: string;
  version: string;

  constructor(
    private readonly titleService: Title,
    private readonly helpService: HelpService,
    private readonly configService: ConfigService,
    private readonly store: Store<AppState>,
    private readonly sideBarSharedService: LeftSideBarSharedService,
    private readonly location: Location
  ) {
  }

  ngOnInit(): void {
    this.logoUrl = this.configService.getConfiguration().images.logo_header;

    // Update title every time language or export id changes
    this.subs.push(combineLatest([
      this.store.select(selectExportId),
      this.store.select(selectDocumentationLanguage)]
    ).pipe(
      debounceTime(10),
      switchMap(() => this.helpService.getTitle()),
      catchError(err => {
        console.error('err : ', err);
        return EMPTY;
      })
    ).subscribe((title: string) => this.setTitle(title)));

    this.version = environment.version;
  }

  ngOnDestroy(): void {
    unsubscribe(this.subs);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sideBarSharedService.handleResponsive(event.target);
  }

  setTitle(title: string): void {
    this.title = title;
    if (title) {
      this.titleService.setTitle(title);
    }
  }

  toggleCollapseSideBar(): void {
    this.sideBarSharedService.toggleCollapseValue();
  }

  historyBack() {
    this.location.back();
  }

  historyForward() {
    this.location.forward();
  }
}
