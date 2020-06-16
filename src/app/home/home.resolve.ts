import { Observable, EMPTY } from 'rxjs';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { HelpActions } from '../ngrx/actions/help.actions';
import { HelpService } from '../help/help.service';
import { ExportInfo } from 'edc-client-js';

@Injectable()
export class HomeResolve implements Resolve<any> {

  constructor(private readonly helpService: HelpService,
              private readonly helpActions: HelpActions) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<void> {
    // Initialize documentation state's export id and language
    this.helpService.getContent().subscribe((exportInfo: ExportInfo) => {
      if (exportInfo != null) {
        this.helpActions.setExportId(exportInfo.pluginId);
        this.helpActions.setDocumentationLanguage(exportInfo.currentLanguage);
      }
    });
    return EMPTY;
  }
}
