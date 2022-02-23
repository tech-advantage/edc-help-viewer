import { Component, OnInit, OnDestroy } from '@angular/core';
import { HelpService } from '../help/help.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from 'app/config.service';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, OnDestroy {
  titleKey = 'global.home.title';
  title: string;
  sub: Subscription;
  stylePath: SafeResourceUrl;

  constructor(
    private readonly helpService: HelpService,
    private readonly translateService: TranslateService,
    private readonly sanitizer: DomSanitizer,
    private readonly configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.initTitle();
    this.stylePath = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configService.getConfiguration().documentationStylePath
    );
  }

  initTitle(): void {
    this.sub = this.helpService
      .getTitle()
      .pipe(switchMap((title: string) => this.translateService.get(this.titleKey, { name: title })))
      .subscribe((translatedTitle: string) => (this.title = translatedTitle));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
