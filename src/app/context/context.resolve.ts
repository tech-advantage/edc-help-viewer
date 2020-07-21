import { assign } from 'lodash';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, Router } from '@angular/router';
import { ContextService } from 'app/context/context.service';
import { INDEX_PARAM, KEY_PARAM, LANG_PARAM, PLUGIN_PARAM, SUB_KEY_PARAM } from 'app/context/context.constants';
import { Helper } from 'edc-client-js';
import { HelpActions } from 'app/ngrx/actions/help.actions';
import { Doc } from 'app/documentations/documentation';

@Injectable()
export class ContextResolve implements Resolve<any> {
  constructor(
    private readonly router: Router,
    private readonly contextService: ContextService,
    private readonly helpActions: HelpActions
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<void> {
    const params: Params = route.params;
    const pluginId = params[PLUGIN_PARAM];
    const langToLoad = params[LANG_PARAM];
    const key = params[KEY_PARAM];
    const subKey = params[SUB_KEY_PARAM];
    const index = Number(params[INDEX_PARAM]);
    return this.getArticle(pluginId, key, subKey, index, langToLoad);
  }

  private getArticle(pluginId: string, key: string, subKey: string, index: number, lang: string): Observable<void> {
    return this.contextService.getArticle(key, subKey, pluginId, lang).pipe(
      map((res: Helper) => {
        if (!res) {
          throw new Error('No Article found');
        }

        const article = assign(new Doc(), res.articles[index], {
          id: undefined,
          label: res.label,
          articles: res.articles,
          links: res.links,
        });
        this.helpActions.setExportId(res.exportId);
        this.helpActions.setDocumentationLanguage(res.language);
        this.helpActions.updateDocumentation(article);
      }),
      catchError(() => {
        this.router.navigate(['info']);
        return EMPTY;
      })
    );
  }
}
