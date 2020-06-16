import { Doc } from './documentations/documentation';

export interface DocState {
  readonly documentation: Doc;
  readonly exportId?: string;
  readonly documentationLanguage: string;
}

export interface AppState {
  readonly app: DocState;
}
