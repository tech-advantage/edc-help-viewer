import { EMPTY, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { HelpActions } from '../ngrx/actions/help.actions';
import { HelpService } from '../help/help.service';
import { ExportInfo } from 'edc-client-js';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { LANG_PARAM, PLUGIN_PARAM } from '../context/context.constants';
import { selectExportId } from '../ngrx/selectors/help-selectors';

@Injectable()
export class HomeResolve implements Resolve<unknown> {
  constructor(
    private readonly helpService: HelpService,
    private readonly helpActions: HelpActions,
    private readonly store: Store<AppState>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<unknown> {
    // Check if plugin id (export id) was provided within parameters
    const pluginId: string = route.params[PLUGIN_PARAM];
    if (pluginId) {
      // Check if it matches any currently loaded export
      this.store.select(selectExportId).pipe(
        tap((exportId: string) => {
          if (exportId !== pluginId) {
            // Not current export, reload export with new export id
            const lang: string = route.params[LANG_PARAM];
            this.helpService.connect(pluginId, lang);
          }
          this.initContent();
        })
      );
    } else {
      this.initContent();
    }
    return EMPTY;
  }

  private initContent(): void {
    this.helpService
      .getContent()
      .pipe(
        tap((exportInfo: ExportInfo) => {
          if (exportInfo != null) {
            this.helpActions.setExportId(exportInfo.pluginId);
            this.helpActions.setDocumentationLanguage(exportInfo.currentLanguage);
          }
        })
      )
      .subscribe();
  }
}
