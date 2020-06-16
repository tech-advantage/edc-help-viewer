import { Routes } from '@angular/router';
import { DocumentationsComponent } from 'app/documentations/documentations.component';
import { DocumentationsResolve } from 'app/documentations/documentations.resolve';
import { ContextResolve } from 'app/context/context.resolve';
import { KEY_PARAM, SUB_KEY_PARAM, LANG_PARAM, INDEX_PARAM, PLUGIN_PARAM } from 'app/context/context.constants';
import { DOC_ID_PARAM } from './documentations.constants';

export const documentationsRoutes: Routes = [
  {
    path     : `context/:${PLUGIN_PARAM}/:${KEY_PARAM}/:${SUB_KEY_PARAM}/:${LANG_PARAM}/:${INDEX_PARAM}`,
    component: DocumentationsComponent,
    resolve  : {
      documentation: ContextResolve
    }
  },
  {
    path: `doc/:${DOC_ID_PARAM}`,
    component: DocumentationsComponent,
    resolve: {
      documentation: DocumentationsResolve
    }
  },
  { // Optional lang parameter, for bootstrapping from a popover link
    path: `doc/:${DOC_ID_PARAM}/:${LANG_PARAM}`,
    component: DocumentationsComponent,
    resolve: {
      documentation: DocumentationsResolve
    }
  },
  { // With plugin parameter, for bootstrapping from a popover link specifying the original publication context
    path: `doc/:${PLUGIN_PARAM}/:${DOC_ID_PARAM}/:${LANG_PARAM}`,
    component: DocumentationsComponent,
    resolve: {
      documentation: DocumentationsResolve
    }
  }
];
