import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchDocComponent } from './search-doc.component';
import { SearchDocService } from './search-doc.service';
import { FormControl } from '@angular/forms';
import { mock, mockPipe, mockService } from '../../../utils/test-helpers';
import { TranslateService } from '@ngx-translate/core';
import { SearchDocResult } from './search-doc-result';
import { TranslateConfig } from '../../../global/config/translate.config';

import { of } from 'rxjs';

describe('SearchDoc component test', () => {
  let searchDocService: SearchDocService;
  let translateConfig: TranslateConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchDocComponent, mockPipe('highlight'), mockPipe('translate')],
      providers: [
        mockService(SearchDocService, ['getDocumentationsByText', 'getSearchValue']),
        mockService(TranslateService, ['instant']),
        mockService(TranslateConfig, ['getCurrentLang']),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    searchDocService = TestBed.inject(SearchDocService);
    translateConfig = TestBed.inject(TranslateConfig);
  });

  const populateComponent = (compInstance) => {
    compInstance.documentations = [
      mock(SearchDocResult, {
        id: 1,
        informationMapId: 57,
      }),
      mock(SearchDocResult, {
        id: 2,
        informationMapId: 58,
      }),
      mock(SearchDocResult, {
        id: 3,
        informationMapId: 59,
      }),
      mock(SearchDocResult, {
        id: 4,
        informationMapId: 60,
      }),
    ];

    compInstance.searchCtrl = new FormControl('');
    return compInstance;
  };

  const initComponent = () => {
    const fixture = TestBed.createComponent(SearchDocComponent);
    fixture.detectChanges();
    return populateComponent(fixture.componentInstance);
  };

  describe('init', () => {
    let componentInstance;
    beforeEach(() => {
      componentInstance = initComponent();
    });
    it('should init component', () => {
      expect(componentInstance).toBeDefined();
    });

    it('should subscribe to search form control', () => {
      componentInstance.subs = [];
      componentInstance.ngOnInit();
      expect(componentInstance.subs.length).toEqual(1);
    });

    it('should call populateDocumentations when search value changed and is greater than 3 characters', async(() => {
      spyOn(componentInstance, 'populateDocumentations');
      expect(componentInstance.documentations.length).toEqual(4);
      componentInstance.ngOnInit();
      componentInstance.isValid = false;
      componentInstance.isOpen = false;
      componentInstance.searchCtrl.setValue('abcde');

      setTimeout(() => {
        expect(componentInstance.populateDocumentations).toHaveBeenCalledTimes(1);
        expect(componentInstance.isValid).toBeTruthy();
        expect(componentInstance.isOpen).toBeTruthy();
        // documentations should not have been reset
        expect(componentInstance.documentations.length).toEqual(4);
      }, 200);
    }));

    it('should NOT call populateDocumentations when search value changed and is smaller than 3 characters', async(() => {
      spyOn(componentInstance, 'populateDocumentations');
      expect(componentInstance.documentations.length).toEqual(4);
      componentInstance.ngOnInit();
      componentInstance.isValid = false;
      componentInstance.isOpen = false;
      componentInstance.searchCtrl.setValue('ab');

      setTimeout(() => {
        expect(componentInstance.populateDocumentations).toHaveBeenCalledTimes(0);
        expect(componentInstance.isValid).toBeFalsy();
        expect(componentInstance.isOpen).toBeTruthy();
        // documentations should have been reset
        expect(componentInstance.documentations.length).toEqual(0);
      }, 200);
    }));
  });

  describe('runtime', () => {
    let componentInstance;

    beforeEach(() => {
      componentInstance = initComponent();
    });

    describe('onFocus', () => {
      beforeEach(() => {
        spyOn(componentInstance, 'populateDocumentations');
      });

      it('should NOT call populateDocumentations if search text length is 0', () => {
        componentInstance.searchCtrl.setValue('');

        componentInstance.onFocus();

        expect(componentInstance.populateDocumentations).toHaveBeenCalledTimes(0);
      });

      it('should NOT open result list if search text length is 0', () => {
        componentInstance.searchCtrl.setValue('');
        componentInstance.isOpen = false;

        componentInstance.onFocus();

        setTimeout(() => expect(componentInstance.isOpen).toBeFalsy(), 200);
      });

      it('should open result droplist and call populateDocumentations if search text has at least one character', async(() => {
        componentInstance.searchCtrl.setValue('ab');
        componentInstance.isOpen = false;

        componentInstance.onFocus();

        expect(componentInstance.populateDocumentations).toHaveBeenCalledTimes(1);
        expect(componentInstance.populateDocumentations).toHaveBeenCalledWith('ab');
        setTimeout(() => expect(componentInstance.isOpen).toBeTruthy(), 200);
      }));
    });

    describe('populateDocumentations', () => {
      const docs = [
        mock(SearchDocResult, {
          id: 87,
          informationMapId: 9874,
        }),
        mock(SearchDocResult, {
          id: 799,
          informationMapId: 591,
        }),
      ];

      beforeEach(() => {
        spyOn(searchDocService, 'getDocumentationsByText').and.returnValue(of(docs));
      });

      it('should NOT subscribe to getDocumentationsByText if search is not valid ', async(() => {
        componentInstance.isValid = false;

        componentInstance.populateDocumentations('abdd');

        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledTimes(0);
      }));

      it('should NOT subscribe to getDocumentationsByText if search length < 3', async(() => {
        componentInstance.isValid = true;

        componentInstance.populateDocumentations('ab');

        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledTimes(0);
      }));

      it('should subscribe to getDocumentationsByText if search is valid and search length > 3', async(() => {
        spyOn(translateConfig, 'getCurrentLang').and.returnValue('en');
        componentInstance.isValid = true;

        componentInstance.populateDocumentations('abdd');

        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledTimes(1);
        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledWith('abdd', 'en', componentInstance.toc);
      }));

      it('should update documentations', async(() => {
        spyOn(translateConfig, 'getCurrentLang').and.returnValue('en');
        componentInstance.isValid = true;
        componentInstance.isLoading = true;
        componentInstance.documentations = [];

        componentInstance.populateDocumentations('abdd');

        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledTimes(1);
        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledWith('abdd', 'en', componentInstance.toc);
        expect(componentInstance.documentations).toEqual(docs);
        expect(componentInstance.isLoading).toBeFalsy();
      }));
      it('lang should be returned by getCurrentLang', async(() => {
        spyOn(translateConfig, 'getCurrentLang').and.returnValue('fr');
        componentInstance.isValid = true;

        componentInstance.populateDocumentations('abdd');

        expect(translateConfig.getCurrentLang).toHaveBeenCalledTimes(1);
        expect(searchDocService.getDocumentationsByText).toHaveBeenCalledWith('abdd', 'fr', componentInstance.toc);
      }));
    });
  });
});
