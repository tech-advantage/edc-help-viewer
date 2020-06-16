import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchDocComponent } from './search-doc.component';
import { SearchDocService } from './search-doc.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../../global/directive/click-outside.directive';
import { HighlightPipe } from '../../../global/pipes/highlight.pipe';
import { KeyboardSelectDirective } from './search-doc.directive';

@NgModule({
  imports        : [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  declarations   : [
    SearchDocComponent,
    ClickOutsideDirective,
    HighlightPipe,
    KeyboardSelectDirective
  ],
  bootstrap: [
    SearchDocComponent
  ],
  providers      : [
    SearchDocService
  ],
  exports: [
    SearchDocComponent
  ]
})
export class SearchDocModule {
}
