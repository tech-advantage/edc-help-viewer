import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {getWindowSize, ScreenSize} from '../../utils/global-helper';
import {WindowRefService} from '../window-ref.service';

@Injectable()
export class LeftSideBarSharedService {

  collapse;

  constructor(private windowRef: WindowRefService) {
    this.collapse = new BehaviorSubject<boolean>(false);
    setTimeout(() => this.handleResponsive(windowRef.nativeWindow), 1);
  }

  handleResponsive(window: Window): void {
    this.setCollapseValue(getWindowSize(window) === ScreenSize.XS);
  }

  isCollapsed(): boolean {
    return this.collapse.getValue();
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
