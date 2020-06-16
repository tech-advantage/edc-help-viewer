import { Injectable } from '@angular/core';
import { HelpService } from 'app/help/help.service';
import { Helper } from 'edc-client-js';

import { Observable } from 'rxjs';

@Injectable()
export class ContextService {

  constructor(private helpService: HelpService) {}

  getArticle(key: string, subKey: string, pluginId: string, lang: string): Observable<Helper> {
    return this.helpService.getContextHelp(key, subKey, pluginId, lang);
  }
}
