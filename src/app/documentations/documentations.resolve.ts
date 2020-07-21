import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, Params } from '@angular/router';
import { DocumentationsService } from 'app/documentations/documentations.service';
import { HelpActions } from 'app/ngrx/actions/help.actions';
import { DOC_ID_PARAM } from 'app/documentations/documentations.constants';
import { DocumentationTransfer } from 'edc-client-js';
import { LANG_PARAM, PLUGIN_PARAM } from '../context/context.constants';
import { Doc } from './documentation';

@Injectable()
export class DocumentationsResolve implements Resolve<any> {
  constructor(
    private readonly router: Router,
    private readonly documentationsService: DocumentationsService,
    private readonly helpActions: HelpActions
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<DocumentationTransfer> {
    const params: Params = route.params;
    const docId = Number(params[DOC_ID_PARAM]);
    const langToLoad = params[LANG_PARAM];
    const pluginId = params[PLUGIN_PARAM];
    return this.getDocumentation(docId, langToLoad, pluginId);
  }

  private getDocumentation(id: number, langCode: string, pluginId: string): Observable<DocumentationTransfer> {
    return this.documentationsService.getDocumentation(id, langCode, pluginId).pipe(
      tap((res: DocumentationTransfer) => {
        if (res) {
          const doc = new Doc(res.doc);
          this.helpActions.setExportId(res.exportId);
          this.helpActions.setDocumentationLanguage(res.resolvedLanguage);
          this.helpActions.updateDocumentation(doc);
        }
        if (!res || !res.doc) {
          this.router.navigate(['info']);
        }
      }),
      catchError(() => {
        this.router.navigate(['info']);
        return of(null);
      })
    );
  }
}
