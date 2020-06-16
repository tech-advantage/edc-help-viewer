import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LeftSideBarSharedService {

  collapse = new BehaviorSubject<boolean>(false);

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
