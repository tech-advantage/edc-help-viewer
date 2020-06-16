import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SYS_LANG } from './language-config';
import { HelpService } from '../../app/help/help.service';
import { AppState } from '../../app/app.state';
import { Store } from '@ngrx/store';
import { selectDocumentationLanguage } from '../../app/ngrx/selectors/help-selectors';
import { tap } from 'rxjs/operators';

@Injectable()
export class TranslateConfig {

  constructor(
    private readonly translate: TranslateService,
    private readonly helpService: HelpService,
    private readonly store: Store<AppState>
  ) {
    translate.use(SYS_LANG);
    store.select(selectDocumentationLanguage).pipe(
      tap((lang: string) => {
        if (lang) {
          this.setCurrentLang(lang);
        }
      })
    ).subscribe();
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  setCurrentLang(lang: string): void {
    this.translate.use(lang);
  }
}
