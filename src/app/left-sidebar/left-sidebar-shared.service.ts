import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {isMobile} from '../../utils/global-helper';
import {WindowRefService} from '../window-ref.service';

@Injectable()
export class LeftSideBarSharedService {

  collapse;
  overlayMode;

  constructor(private windowRef: WindowRefService) {
    this.collapse = new BehaviorSubject<boolean>(false);
    this.overlayMode = new BehaviorSubject<boolean>(false);
    // Workaround to let the translation service load
    setTimeout(() => this.handleResponsive(windowRef.nativeWindow), 1);
  }

  handleResponsive(window: Window): void {
    const mobileMode = isMobile(window, true);
    this.overlayMode = mobileMode;
    this.setCollapseValue(mobileMode);
  }

  isCollapsed(): boolean {
    return this.collapse.getValue();
  }

  isInOverlayMode(): boolean {
    return this.overlayMode;
  }

  /**
  * Change the value of collapse.
  * true => false
  * false => true
  */
  toggleCollapseValue() {
    this.setCollapseValue(!this.collapse.getValue());
  }

  setCollapseValue(newVal: boolean) {
    this.collapse.next(newVal);
  }
}
