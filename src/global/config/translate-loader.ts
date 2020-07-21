import { merge } from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { SYS_LANG, LOCAL_I18N } from './language-config';
import { HelpService } from '../../app/help/help.service';

export class TranslateLoader {
  constructor(
    private readonly http: HttpClient,
    private readonly helpService: HelpService,
    private readonly defaultLanguage = SYS_LANG,
    private readonly prefix = '',
    private readonly suffix = '.json'
  ) {}

  getTranslation(lang: string = SYS_LANG): Observable<unknown> {
    const langToUse = this.helpService.isLanguageCodePresent(lang) ? lang : this.defaultLanguage;
    return this.http.get(`${this.prefix}/${langToUse}${this.suffix}`).pipe(
      map((file) => this.mergeI18nFiles(file, lang)),
      catchError(() => of(this.getLocalI18nFile(lang)))
    );
  }

  /**
   * Return a file that is the result from merging the local i18n file with the ones provided in the export
   * All keys will be present in resulting file
   * the ones present in the export i18n files will override the local ones
   * @param file the file from the export, whose values will override the local ones
   * @param lang the requested language code
   */
  mergeI18nFiles(file: unknown, lang: string): unknown {
    const localFile = this.getLocalI18nFile(lang);
    return merge(localFile, file);
  }

  /**
   * Get the i18n json file for the requested lang
   * Will be called if no i18n file was found in the export for this lang
   *
   * @param lang the lang code
   * @param defaultLanguage default lang code
   */
  getLocalI18nFile(lang: string, defaultLanguage: string = this.defaultLanguage): unknown {
    // LOCAL_I18N object contains the local i18n json files, defined in the project
    return (lang && LOCAL_I18N[lang]) || (defaultLanguage && LOCAL_I18N[defaultLanguage]) || LOCAL_I18N[SYS_LANG];
  }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient, helpService: HelpService): TranslateLoader {
  const defaultLanguage = helpService.getDefaultLanguage() || SYS_LANG;
  const i18nUrl = helpService.getI18nUrl();
  return new TranslateLoader(http, helpService, defaultLanguage, i18nUrl);
}
