import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ConfigService} from './config.service';
import {LeftSideBarSharedService} from './left-sidebar/left-sidebar-shared.service';
import {unsubscribe} from 'utils/global-helper';

import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  themeStylePath: SafeResourceUrl;
  collapsed = false;
  overlayMode = false;
  subs: Subscription[] = [];

  @ViewChild('leftSidebar', {read: ElementRef, static: false})
  leftSidebar: ElementRef;

  constructor(private readonly configService: ConfigService,
              readonly sideBarSharedService: LeftSideBarSharedService,
              private readonly sanitizer: DomSanitizer,
              private readonly renderer: Renderer2) {
    /* Handle close on click outside when overlayMode is enabled */
    this.renderer.listen('window', 'click', ( e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */

      if (this.leftSidebar && sideBarSharedService.isInOverlayMode() && !sideBarSharedService.isCollapsed() &&
        !this.leftSidebar.nativeElement.contains(e.target) && !sideBarSharedService.panelToggleElem.nativeElement.contains(e.target)) {
        sideBarSharedService.setCollapseValue(true);
      }
    });
  }

  ngOnInit() {
    this.updateFavicon();
    this.addThemeStyle();
    this.subs.push(this.sideBarSharedService.collapse.subscribe((collapse) => this.collapsed = collapse));
    this.subs.push(this.sideBarSharedService.overlayMode.subscribe((overlayMode) => this.overlayMode = overlayMode));
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
