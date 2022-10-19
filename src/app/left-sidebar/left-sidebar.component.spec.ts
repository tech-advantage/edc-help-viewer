import { of } from 'rxjs';
import { assign } from 'lodash';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar.component';
import { mock, mockService } from '../../utils/test-helpers';
import { InformationMap } from 'edc-client-js';
import { LeftSidebarService } from './left-sidebar.service';
import { HelpInformationMap } from '../../global/classes/help-information-map';
import { HelpDocumentation } from '../../global/classes/help-documentation';
import { TypeDocumentation } from '../documentations/type-documentation';
import { getNestedMatches } from '../../utils/global-helper';

import { ConfigService } from '../config.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DocState } from '../app.state';
import { Doc } from '../documentations/documentation';

describe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let leftSidebarService: LeftSidebarService;
  let configService: ConfigService;
  let router: Router;
  let store: Store<unknown>;

  let rawInfoMap: InformationMap;
  let info1, info2: HelpInformationMap;
  let docState: DocState;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeftSidebarComponent],
      providers: [
        mockService(LeftSidebarService, ['getCurrentDoc', 'initToc', 'getCurrentInformationMap', 'countResult']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(Router, [], 'events'),
        mockService(Store, ['select']),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    configService = TestBed.inject(ConfigService);
    leftSidebarService = TestBed.inject(LeftSidebarService);
  });

  beforeEach(() => {
    rawInfoMap = mock(InformationMap, { id: 7, topics: [] });
    info1 = mock(HelpInformationMap, { id: 5, topics: [] });
    info2 = mock(HelpInformationMap, { id: 7, topics: [] });
    assign(router.events, of());
    docState = {
      documentation: mock(Doc, { id: 14, topics: [info1, info2] }),
      documentationLanguage: 'it',
      exportId: 'myExportId',
    };
    spyOn(configService, 'getConfiguration').and.returnValue({ 
      docPath: 'myDoc',
      documentationStylePath: 'myDocStylePath',
      themeStylePath: 'myThemeStylePath', 
      images: {
        favicon: 'myFaviconUrl',
        logo_header: 'myLogoHeader',
        logo_info: 'myLogoInfo'
      },
      libsUrl: {
        mathjax: 'mathjaxLib'
      },
      contentSearch: {
        maxResultNumber: 25,
        matchWholeWord: false,
        matchCase: false,
        enable: false,
        url: ''
      },
      collapseTocAsDefault: true,
      displayFirstDocInsteadOfToc: false,
      fullHeightRightSidebarOnMobile: false
    });
    spyOn(store, 'select').and.returnValue(of(docState));
    spyOn(leftSidebarService, 'initToc').and.returnValue(of([info1, info2]));
    spyOn(leftSidebarService, 'getCurrentInformationMap').and.returnValue(of(rawInfoMap));
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeDefined();
    expect(component.informationMapList).toEqual([info1, info2]);
    expect(component.opened).toEqual(info2);
  }));

  describe('runtime', () => {
    it('should be open', () => {
      const opened = mock(HelpInformationMap, { id: 5 });
      component.opened = opened;
      expect(component.isOpen(opened)).toBeTruthy();
    });

    it('should be open', () => {
      const opened = mock(HelpInformationMap, { id: 5 });
      const other = mock(HelpInformationMap, { id: 3 });
      component.opened = opened;
      expect(component.isOpen(other)).toBeFalsy();
    });

    describe('handleSearchMatchingDocs', () => {
      let doc1, doc2, doc3, doc4, doc5, doc6, doc7: HelpDocumentation;
      let docs: HelpDocumentation[];
      beforeEach(() => {
        doc1 = {
          id: 1,
          topics: [],
          type: TypeDocumentation.DOCUMENT,
        };
        doc2 = mock(HelpDocumentation, {
          id: 2,
          topics: [doc1],
          type: TypeDocumentation.DOCUMENT,
        });
        doc3 = mock(HelpDocumentation, {
          id: 3,
          topics: [],
          type: TypeDocumentation.DOCUMENT,
        });
        doc4 = mock(HelpDocumentation, {
          id: 4,
          topics: [],
          type: TypeDocumentation.DOCUMENT,
        });
        doc5 = mock(HelpDocumentation, {
          id: 5,
          topics: [doc4],
          type: TypeDocumentation.DOCUMENT,
        });
        doc6 = mock(HelpDocumentation, {
          id: 6,
          topics: [doc5],
          type: TypeDocumentation.DOCUMENT,
        });
        doc7 = mock(HelpDocumentation, {
          id: 7,
          topics: [doc2],
          type: TypeDocumentation.CHAPTER,
        });
        docs = [doc3, doc6, doc7];
      });

      it('should add the right match flag', () => {
        component.searchResultIds = [2];

        component.handleSearchMatchingDocs(docs);

        expect(getNestedMatches(docs, 'topics', '$matchesSearch')).toEqual([doc2]);
      });
    });
  });
});
