import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolve } from './home.resolve';
import { LANG_PARAM, PLUGIN_PARAM } from '../context/context.constants';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    resolve: {
      documentation: HomeResolve,
    },
  },
  {
    path: `home/:${PLUGIN_PARAM}`,
    component: HomeComponent,
    resolve: {
      documentation: HomeResolve,
    },
  },
  {
    path: `home/:${PLUGIN_PARAM}/:${LANG_PARAM}`,
    component: HomeComponent,
    resolve: {
      documentation: HomeResolve,
    },
  },
];
