import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { unsubscribe } from 'utils/global-helper';
import { SearchDocService } from './search-doc.service';
import { SearchDocResult } from './search-doc-result';
import { TranslateService } from '@ngx-translate/core';
import { HelpInformationMap } from 'global/classes/help-information-map';

import { Subscription } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateConfig } from '../../../global/config/translate.config';

@Component({
  selector: 'app-search-doc',
  templateUrl: './search-doc.component.html',
  styleUrls: ['./search-doc.component.less'],
})
export class SearchDocComponent implements OnInit, OnDestroy {
  // List of documentations matching search for the droplist
  documentations: SearchDocResult[] = [];

  // Template data.
  isOpen = false;
  isLoading = false;
  isValid = false;
  resultsNumber = 10;

  subs: Subscription[] = [];

  // Search input control.
  searchCtrl: FormControl;

  @Input() informationMaps: HelpInformationMap[];
  @Output() searchResultsChange = new EventEmitter<SearchDocResult[]>();

  constructor(
    private readonly searchDocService: SearchDocService,
    private readonly translateService: TranslateService,
    private readonly translateConfig: TranslateConfig
  ) {}

  ngOnInit(): void {
    this.initSearchField();
  }

  ngOnDestroy(): void {
    unsubscribe(this.subs);
  }

  isShowMoreVisible(): boolean {
    return this.documentations.length > this.resultsNumber;
  }

  showMore($event: Event): void {
    this.resultsNumber += 10;
    $event.preventDefault();
    $event.stopPropagation();
  }

  /**
   * Open the dropdown on input focus, only if something has already been typed.
   */
  onFocus(): void {
    if (this.searchCtrl.value.length) {
      // Have to use setTimeout otherwise 'DropdownOutsideClickDirective' close the dropdown.
      this.populateDocumentations(this.searchCtrl.value);
      setTimeout(() => (this.isOpen = true), 200);
    }
  }

  /**
   * Closes dropdown (see DropdownOutsideClickDirective).
   */
  closeDropdown(): void {
    this.isOpen = false;
  }

  /**
   * Sets search input control listener.
   */
  private initSearchField(): void {
    this.searchCtrl = new FormControl('');
    this.subs.push(
      this.searchCtrl.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((value) => {
        this.isOpen = !!value;
        if (value.length >= 3) {
          this.isValid = true;
          this.populateDocumentations(value);
        } else {
          this.isValid = false;
          this.documentations = [];
          this.searchResultsChange.emit([]);
        }
      })
    );
  }

  /**
   * Populates the documentation list.
   * @param search the search input text.
   */
  private populateDocumentations(search: string): void {
    this.resultsNumber = 10;

    if (this.isValid && search && search.length > 2) {
      this.isLoading = true;
      this.subs.push(
        this.searchDocService
          .getDocumentationsByText(search, this.translateConfig.getCurrentLang(), this.informationMaps)
          .subscribe((docs) => {
            this.isLoading = false;
            this.documentations = docs;
            this.searchResultsChange.emit(docs);
          })
      );
    }
  }

  getPlaceholder(): unknown {
    return this.translateService.instant('global.search.placeholder');
  }
}
