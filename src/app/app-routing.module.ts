import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { documentationsRoutes } from './documentations/documentations.routes';
import { InfoPageComponent } from './info/info-page.component';
import { infoRoutes } from './info/info.routes';
import { homeRoutes } from './home/home.routes';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    children: [
      ...documentationsRoutes,
      ...infoRoutes,
      ...homeRoutes,
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: '**',
        component: InfoPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppRoutingModule {}
