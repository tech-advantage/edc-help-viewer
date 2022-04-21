import { NgModule } from '@angular/core';
import { HtmlPipe } from 'global/pipes/html.pipe';
import { AnchorPipe } from 'global/pipes/anchor.pipe';
import { SafePipe } from 'global/pipes/safe.pipe';
import { HighlightPipe } from 'global/pipes/highlight.pipe';

@NgModule({
  declarations: [HtmlPipe, AnchorPipe, SafePipe, HighlightPipe],
  exports: [HtmlPipe, AnchorPipe, SafePipe, HighlightPipe],
})
export class SharedPipeHtmlModule {}
