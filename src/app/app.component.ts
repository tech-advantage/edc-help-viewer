import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from './config.service';
import { LeftSideBarSharedService } from './left-sidebar/left-sidebar-shared.service';
import { unsubscribe } from 'utils/global-helper';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  themeStylePath: SafeResourceUrl;
  collapsed = false;
  subs: Subscription[] = [];

  constructor(private readonly configService: ConfigService,
              private readonly sideBarSharedService: LeftSideBarSharedService,
              private readonly sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.updateFavicon();
    this.addThemeStyle();
    this.subs.push(this.sideBarSharedService.collapse.subscribe((collapse) => this.collapsed = collapse));
  }

  ngOnDestroy() {
    unsubscribe(this.subs);
  }

  /**
   * Replace favicon.
   */
  updateFavicon() {
    const faviconUrl = this.configService.getConfiguration().images.favicon;

    const link: HTMLLinkElement = document.querySelector(`link[rel*='icon']`) as HTMLLinkElement;
    if (link && faviconUrl) {
      link.href = faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }

  addThemeStyle() {
    this.themeStylePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.configService.getConfiguration().themeStylePath);
  }
}
