import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { isMobile } from '../../utils/global-helper';
import { WindowRefService } from '../window-ref.service';

@Injectable()
export class LeftSideBarSharedService {
  collapse;
  overlayMode;
  panelToggleElem;

  constructor(private windowRef: WindowRefService) {
    this.collapse = new BehaviorSubject<boolean>(false);
    this.overlayMode = new BehaviorSubject<boolean>(false);
    // Workaround to let the translation service load
    setTimeout(() => this.handleResponsive(windowRef.nativeWindow), 1);
  }

  handleResponsive(window: Window): void {
    const mobileMode = isMobile(window, true);
    this.setOverlayMode(mobileMode);
    this.setCollapseValue(mobileMode);
  }

  isInOverlayMode(): boolean {
    return this.overlayMode.getValue();
  }

  isCollapsed(): boolean {
    return this.collapse.getValue();
  }

  /**
   * Change the value of collapse.
   * true => false
   * false => true
   */
  toggleCollapseValue(): void {
    this.setCollapseValue(!this.collapse.getValue());
  }

  setCollapseValue(newVal: boolean): void {
    this.collapse.next(newVal);
  }

  setOverlayMode(newVal: boolean): void {
    this.overlayMode.next(newVal);
  }
}
