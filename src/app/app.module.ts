import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule, LOCATION_INITIALIZED, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from './config.service';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header';
import { TranslateConfig } from '../global/config/translate.config';
import { DocumentationsModule } from './documentations/documentations.module';
import { InfoPageModule } from './info/info-page.module';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { HelpActions } from './ngrx/actions/help.actions';
import { HelpService } from './help/help.service';
import { LeftSideBarSharedService } from './left-sidebar/left-sidebar-shared.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TreeModule } from './left-sidebar/tree/tree.module';
import { HomeComponent } from './home/home.component';
import { SearchDocModule } from './left-sidebar/search-doc/search-doc.module';
import { LeftSidebarService } from 'app/left-sidebar/left-sidebar.service';
import { reducerProvider, reducerToken } from './ngrx/reducers/app-reducers';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpLoaderFactory } from '../global/config/translate-loader';
import { HomeResolve } from './home/home.resolve';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    HomeComponent
  ],
  imports: [
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient, HelpService, PathLocationStrategy ]
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    StoreModule.forRoot(reducerToken),
    !environment.production ? StoreDevtoolsModule.instrument({maxAge: 5}) : [],
    FormsModule,
    HttpClientModule,
    DocumentationsModule,
    InfoPageModule,
    TreeModule,
    SearchDocModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ ConfigService, Injector ],
      multi: true
    },
    reducerProvider,
    TranslateConfig,
    PathLocationStrategy,
    HelpActions,
    HelpService,
    LeftSideBarSharedService,
    LeftSidebarService,
    HomeResolve
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

/**
 * Did it because there was a bug on ng@4.0.3 & cli@1.0.0 & IE11.
 * => Issue here : https://github.com/angular/angular-cli/issues/5762
 * For more info, see previous version on this file.
 * And read this very related issue https://github.com/angular/angular/issues/14459.
 */
export function ConfigLoader(configService: ConfigService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      return configService.load(environment.configFile).then(() => resolve());
    });
  });
}
