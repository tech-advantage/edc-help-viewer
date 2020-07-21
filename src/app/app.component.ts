import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
              private readonly sanitizer: DomSanitizer) {
  }

  /* Handle close on click outside when overlayMode is enabled */
  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    /**
     * Only runs when in overlay mode and clicked element is in sidebar container
     */
    if (this.leftSidebar && this.sideBarSharedService.isInOverlayMode() && !this.sideBarSharedService.isCollapsed() &&
      !this.leftSidebar.nativeElement.contains(e.target) && this.sideBarSharedService.panelToggleElem &&
      !this.sideBarSharedService.panelToggleElem.nativeElement.contains(e.target)) {

      this.sideBarSharedService.setCollapseValue(true);
    }
  }

  ngOnInit() {
    this.loadLibs();
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

  loadLibs() {
    const libs = this.configService.getConfiguration().libsUrl;
    for (const lib in libs) {
      if (libs.hasOwnProperty(lib)) {
        const node = document.createElement('script'); // creates the script tag
        node.src = libs[lib]; // sets the source (insert url in between quotes)
        node.type = 'text/javascript'; // set the script type
        node.async = true; // makes script run asynchronously
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
  }
}
