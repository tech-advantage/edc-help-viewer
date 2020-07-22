import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'app/left-sidebar/tree/tree.module';
import { LinksModule } from 'app/links/links.module';
import { SharedPipeHtmlModule } from 'app/shared/shared-pipe-html.module';
import { DocumentationsService } from 'app/documentations/documentations.service';
import { DocumentationsResolve } from 'app/documentations/documentations.resolve';
import { ContextService } from 'app/context/context.service';
import { ContextResolve } from 'app/context/context.resolve';
import { DocumentationContentComponent } from 'app/documentations/documentation-content/documentation-content.component';
import { DocumentationsComponent } from 'app/documentations/documentations.component';
import { MathjaxDirective } from '../../global/directive/mathjax.directive';
import { GlossaryOnclickDirective } from '../../global/directive/glossary-onclick.directive';
import { GlossaryBarComponent } from './glossary-bar/glossary-bar.component';

@NgModule({
  imports: [CommonModule, TranslateModule, RouterModule, SharedPipeHtmlModule, LinksModule, TreeModule],
  providers: [DocumentationsService, DocumentationsResolve, ContextService, ContextResolve],
  declarations: [
    DocumentationsComponent,
    DocumentationContentComponent,
    MathjaxDirective,
    GlossaryOnclickDirective,
    GlossaryBarComponent,
  ],
})
export class DocumentationsModule {}
