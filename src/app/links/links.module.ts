import { NgModule } from '@angular/core';
import { LinksComponent } from './links.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [
    LinksComponent
  ],
  exports: [
    LinksComponent
  ]
})
export class LinksModule {
}
