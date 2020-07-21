import { HelpAction } from '../actions/help.actions';
import { DocState } from '../../app.state';
import { ActionTypes } from '../actions/action-types';

export const initialState: DocState = {
  documentation: {
    id: null,
    exportId: null,
    label: null,
    topics: null,
    url: null,
    content: null,
    links: null,
    articles: null,
  },
  exportId: null,
  documentationLanguage: null,
};

export const appReducers = (state: DocState = initialState, action: HelpAction): DocState => {
  switch (action.type) {
    case ActionTypes.UPDATE_DOC_STATE: {
      return { ...state, ...action.payload };
    }
    case ActionTypes.UPDATE_DOCUMENTATION: {
      return { ...state, ...{ documentation: action.payload } };
    }

    case ActionTypes.SET_DOCUMENTATION_LANGUAGE: {
      return { ...state, ...{ documentationLanguage: action.payload } };
    }

    case ActionTypes.SET_EXPORT_ID: {
      return { ...state, ...{ exportId: action.payload } };
    }
    default: {
      return state;
    }
  }
};
