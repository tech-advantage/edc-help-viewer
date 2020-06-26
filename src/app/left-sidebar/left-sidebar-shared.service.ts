import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {getWindowSize, ScreenSize} from '../../utils/global-helper';


@Injectable()
export class LeftSideBarSharedService {

  collapse;

  constructor(private window: Window) {
    this.collapse = new BehaviorSubject<boolean>(this.getDefaultValue(window));
  }

  getDefaultValue(window: Window): boolean {
    return getWindowSize(window) === ScreenSize.XS;
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
    this.collapse.next(!this.collapse.getValue());
  }
}
