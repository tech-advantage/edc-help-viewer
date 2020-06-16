import { NgModule } from '@angular/core';
import { InfoPageComponent } from './info-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports     : [
    CommonModule,
    TranslateModule
  ],
  providers   : [],
  declarations: [InfoPageComponent],
  bootstrap   : [InfoPageComponent]
})
export class InfoPageModule { }

// Parameter name in URL for info type.
export const urlTypeKey = 'type';
