import { NgModule } from '@angular/core';
import { HtmlPipe } from 'global/pipes/html.pipe';
import { AnchorPipe } from 'global/pipes/anchor.pipe';
import { SafePipe } from 'global/pipes/safe.pipe';

@NgModule({
  declarations: [
    HtmlPipe,
    AnchorPipe,
    SafePipe
  ],
  exports     : [
    HtmlPipe,
    AnchorPipe,
    SafePipe
  ]
})
export class SharedPipeHtmlModule {
}
