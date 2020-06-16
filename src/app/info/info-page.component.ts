import { Component, OnInit } from '@angular/core';
import { InfoPageFactory, InfoTypes } from './info-page.factory';
import { EdcInfo } from './edc-info';
import { ConfigService } from '../config.service';

@Component({
  selector : 'app-info-page',
  styleUrls: ['info-page.less'],
  template : `
    <div class="edc-info-container">
      <div class="edc-info-header">
        <img class="edc-info-logo" [src]="logoUrl"/>
      </div>
      <div class="edc-info-content">
        <div class="theme edc-info-title" [innerHTML]="edcInfo.title | translate"></div>
        <div class="edc-info-subtitle">{{edcInfo.subtitle | translate}}</div>
        <div class="edc-info-icon">
          <div class="edc-info-badge">
            <i class="fa" [ngClass]="edcInfo.iconCss"></i>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InfoPageComponent implements OnInit {

  edcInfo: EdcInfo;
  logoUrl: string;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    const infoType = InfoTypes['notFound'] || InfoTypes['default'];
    this.edcInfo = InfoPageFactory(infoType.toString());
    this.logoUrl = this.configService.getConfiguration().images.logo_info;
  }
}
