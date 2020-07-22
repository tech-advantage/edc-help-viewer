import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { HelpService } from 'app/help/help.service';
import { DocumentationTransfer } from 'edc-client-js';

@Injectable()
export class DocumentationsService {
  constructor(private helpService: HelpService) {}

  getDocumentation(docId: number, langCode?: string, pluginId?: string): Observable<DocumentationTransfer> {
    return this.helpService.getDocumentation(docId, langCode, pluginId);
  }
}
