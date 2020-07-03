import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {getWindowSize, ScreenSize} from '../../utils/global-helper';
import { WindowRefService } from '../window-ref.service';


@Injectable()
export class LeftSideBarSharedService {

  collapse;

  constructor(private windowRef: WindowRefService) {
    this.collapse = new BehaviorSubject<boolean>(false);
    if (this.getDefaultValue(windowRef.nativeWindow)) {
      /* Workaround because when left sidebar is hidden, it can't load title translation
         So we use setTimeout for waiting the DOM and services to load */
      setTimeout(() => this.toggleCollapseValue(), 1);
    }
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
