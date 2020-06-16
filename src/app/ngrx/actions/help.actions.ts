import { isEqual } from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, DocState } from '../../app.state';
import { Doc } from '../../documentations/documentation';
import { selectDocumentationLanguage, selectExportId, selectDocumentation } from '../selectors/help-selectors';
import { take } from 'rxjs/operators';
import { ActionWithPayload } from '../store/action-with-payload';
import { ActionTypes } from './action-types';

@Injectable()
export class HelpActions {

  constructor(private readonly store: Store<AppState>) {
  }

  updateDocState(docState: DocState): void {
    if (docState) {
      this.store.dispatch(new DocumentationStateAction(docState));
    }
  }

  updateDocumentation(documentation: Doc): void {
    if (documentation) {
      let currentDoc: Doc = null;
      // Take the current value (ngrx store returns a synchronous observable)
      const sub = this.store.select(selectDocumentation).pipe(take(1))
        .subscribe((doc: Doc) => currentDoc = doc);
      if (currentDoc && !isEqual(currentDoc, documentation)) {
        this.store.dispatch(new DocumentationAction(documentation));
      }
      sub.unsubscribe();
    }
  }

  setDocumentationLanguage(newLang: string): void {
    if (newLang) {
      let currentLanguage = '';
      // Take the current value (ngrx store returns a synchronous observable)
      const sub = this.store.select(selectDocumentationLanguage).pipe(take(1))
        .subscribe((langCode: string) => currentLanguage = langCode);
      if (newLang !== currentLanguage) {
        this.store.dispatch(new DocumentationLanguageAction(newLang));
      }
      sub.unsubscribe();
    }
  }

  setExportId(newExportId: string): void {
    if (newExportId) {
      let currentExportId = '';
      // Take the current value (ngrx store returns a synchronous observable)
      const sub = this.store.select(selectExportId).pipe(take(1))
        .subscribe((langCode: string) => currentExportId = langCode);
      if (newExportId !== currentExportId) {
        this.store.dispatch(new ExportIdAction(newExportId));
      }
      sub.unsubscribe();
    }
  }
}

export class DocumentationStateAction implements ActionWithPayload<DocState> {
  readonly type = ActionTypes.UPDATE_DOC_STATE;
  constructor(public payload: DocState) { }
}

export class DocumentationAction implements ActionWithPayload<Doc> {
  readonly type = ActionTypes.UPDATE_DOCUMENTATION;
  constructor(public payload: Doc) { }
}

export class ExportIdAction implements ActionWithPayload<string> {
  readonly type = ActionTypes.SET_EXPORT_ID;
  constructor(public payload: string) { }
}

export class DocumentationLanguageAction implements ActionWithPayload<string> {
  readonly type = ActionTypes.SET_DOCUMENTATION_LANGUAGE;
  constructor(public payload: string) { }
}

export type HelpAction = DocumentationStateAction | DocumentationAction | ExportIdAction | DocumentationLanguageAction;
