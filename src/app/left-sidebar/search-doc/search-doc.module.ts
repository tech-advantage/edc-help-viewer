import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchDocComponent } from './search-doc.component';
import { SearchDocService } from './search-doc.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../../global/directive/click-outside.directive';
import { KeyboardSelectDirective } from './search-doc.directive';
import { SharedPipeHtmlModule } from 'app/shared/shared-pipe-html.module';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule, ReactiveFormsModule, SharedPipeHtmlModule, BsDropdownModule.forRoot()],
  declarations: [SearchDocComponent, ClickOutsideDirective, KeyboardSelectDirective],
  bootstrap: [SearchDocComponent],
  providers: [SearchDocService],
  exports: [SearchDocComponent],
})
export class SearchDocModule {}
