import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpService } from '../help/help.service';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector   : 'app-home',
  templateUrl: './home.component.html',
  styleUrls  : ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  titleKey = 'global.home.title';
  title: string;
  sub: Subscription;

  constructor(private readonly helpService: HelpService, private readonly translateService: TranslateService) {}

  ngOnInit() {
    this.initTitle();
  }

  initTitle(): void {
    this.sub = this.helpService.getTitle()
      .pipe(switchMap((title: string) => this.translateService.get(this.titleKey, {name: title})))
      .subscribe((translatedTitle: string) => this.title = translatedTitle);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
