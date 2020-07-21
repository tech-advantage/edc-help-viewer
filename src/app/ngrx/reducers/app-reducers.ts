import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../../app.state';
import { appReducers } from './help.reducers';

export const reducerToken = new InjectionToken<ActionReducerMap<AppState>>('Reducers');

export function getReducers() {
  return {
    app: appReducers,
  };
}

export const reducerProvider = [{ provide: reducerToken, useFactory: getReducers }];
