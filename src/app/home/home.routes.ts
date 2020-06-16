import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolve } from './home.resolve';

export const homeRoutes: Routes = [
  {
    path     : 'home',
    component: HomeComponent,
    resolve  : {
      documentation: HomeResolve
    }
  }
];
