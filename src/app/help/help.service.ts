import { from, Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { DocumentationTransfer, EdcClient, ExportInfo, Helper, InformationMap, Toc } from 'edc-client-js';
import { ConfigService } from '../config.service';

import { SYS_LANG } from '../../global/config/language-config';

@Injectable()
export class HelpService {
  public edcClient: EdcClient;

  constructor(private readonly configService: ConfigService) {
    this.connect();
  }

  getContent(): Observable<ExportInfo> {
    return from<Promise<ExportInfo>>(this.edcClient.getContent());
  }

  connect(): void {
    this.edcClient = new EdcClient(this.configService.getConfiguration().docPath);
  }

  getTitle(): Observable<string> {
    return from<Promise<string>>(this.edcClient.getTitle());
  }

  getContextHelp(primaryKey: string, subKey: string, pluginId: string, lang: string): Observable<Helper> {
    return from<Promise<Helper>>(this.edcClient.getHelper(primaryKey, subKey, pluginId, lang));
  }

  getDocumentation(id: number, lang: string, pluginId?: string): Observable<DocumentationTransfer> {
    return from(this.edcClient.getDocumentation(id, lang, pluginId));
  }

  getInformationMapFromDocId(id: number): Observable<InformationMap> {
    return from(this.edcClient.getInformationMapFromDocId(id));
  }

  getToc(pluginId?: string): Promise<Toc> {
    return Promise.resolve(this.edcClient.getToc(pluginId));
  }

  getI18nUrl(): string {
    return this.edcClient.getWebHelpI18nUrl();
  }

  getDefaultLanguage(): string {
    return (this.edcClient && this.edcClient.getDefaultLanguage && this.edcClient.getDefaultLanguage()) || SYS_LANG;
  }

  isLanguageCodePresent(lang: string): boolean {
    return this.edcClient.isLanguagePresent(lang);
  }
}
