import { AppState, DocState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectDocState = (state: AppState): DocState => state.app;

export const selectDocumentation = createSelector(selectDocState, (state: DocState) => state && state.documentation);
export const selectDocumentationLanguage = createSelector(
  selectDocState,
  (state: DocState) => state && state.documentationLanguage
);
export const selectExportId = createSelector(selectDocState, (state: DocState) => state && state.exportId);
