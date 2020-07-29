import { of } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { SearchDocService } from './search-doc.service';
import { mockService, mock } from 'utils/test-helpers';
import { ConfigService } from '../../config.service';
import { TypeDocumentation } from '../../documentations/type-documentation';
import { HelpInformationMap } from 'global/classes/help-information-map';
import { HelpDocumentation } from 'global/classes/help-documentation';
import { TranslateConfig } from '../../../global/config/translate.config';

describe('SearchDocService', () => {
  let service: SearchDocService;
  let configService: ConfigService;
  let http: HttpClient;
  let translateConfig: TranslateConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchDocService,
        mockService(ConfigService, ['useHttpdServer']),
        mockService(HttpClient, ['get']),
        mockService(TranslateConfig, ['getCurrentLang']),
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SearchDocService);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    translateConfig = TestBed.inject(TranslateConfig);
  });

  beforeEach(() => {
    spyOn(http, 'get').and.returnValue(of(new HttpResponse({ body: [] })));
    spyOn(translateConfig, 'getCurrentLang').and.returnValue('en');
  });

  describe('getDocumentationsByText', () => {
    let informationMaps: HelpInformationMap[];
    let infomap1, infomap2: HelpInformationMap;
    let doc1, doc2, doc3, doc4, doc5: HelpDocumentation;
    beforeEach(() => {
      doc1 = {
        id: 2,
        label: 'document 1',
        topics: [],
        type: TypeDocumentation.DOCUMENT,
      };
      doc2 = mock(HelpDocumentation, {
        id: 32,
        label: 'document 2',
        topics: [doc1],
        type: TypeDocumentation.DOCUMENT,
      });
      doc3 = mock(HelpDocumentation, {
        id: 31,
        label: 'document 3',
        topics: [],
        type: TypeDocumentation.DOCUMENT,
      });
      doc4 = mock(HelpDocumentation, {
        id: 41,
        label: 'document-2 4',
        topics: [],
        type: TypeDocumentation.DOCUMENT,
      });
      doc5 = mock(HelpDocumentation, {
        id: 21,
        label: 'document-2 5',
        topics: [doc4],
        type: TypeDocumentation.DOCUMENT,
      });
      infomap1 = mock(HelpInformationMap, {
        id: 4,
        label: 'label infoMap1',
        topics: [doc2, doc3],
      });
      infomap2 = mock(HelpInformationMap, {
        id: 7,
        label: 'label infoMap2',
        topics: [doc5],
      });
      informationMaps = [infomap1, infomap2];
    });
    it('should call webservice if help configured with http server', () => {
      spyOn(configService, 'useHttpdServer').and.returnValue(true);
      service.getDocumentationsByText('mySearch').subscribe((results) => {
        expect(results).toBeDefined();
        const params: HttpParams = new HttpParams().set('query', 'mySearch');
        expect(http.get).toHaveBeenCalledWith('/httpd/api/search', { params });
      });
    });
    it('should NOT call webservice if help configured without http server', () => {
      spyOn(configService, 'useHttpdServer').and.returnValue(false);
      service.getDocumentationsByText('mySearch').subscribe((results) => {
        expect(results).toBeDefined();
        expect(http.get).not.toHaveBeenCalled();
      });
    });
    it('should return 5 results', () => {
      spyOn(configService, 'useHttpdServer').and.returnValue(false);
      service.getDocumentationsByText('document', informationMaps).subscribe((results) => {
        expect(results).toBeDefined();
        expect(results.length).toEqual(5);
        expect(results).toEqual([
          service.createResult(doc1, infomap1),
          service.createResult(doc2, infomap1),
          service.createResult(doc3, infomap1),
          service.createResult(doc4, infomap2),
          service.createResult(doc5, infomap2),
        ]);
      });
    });
    it('should return 2 results', () => {
      spyOn(configService, 'useHttpdServer').and.returnValue(false);
      service.getDocumentationsByText('document-2', informationMaps).subscribe((results) => {
        expect(results).toBeDefined();
        expect(results.length).toEqual(2);
        expect(results).toEqual([service.createResult(doc4, infomap2), service.createResult(doc5, infomap2)]);
      });
    });
    it('should return 1 result', () => {
      spyOn(configService, 'useHttpdServer').and.returnValue(false);
      service.getDocumentationsByText('document 3', informationMaps).subscribe((results) => {
        expect(results).toBeDefined();
        expect(results.length).toEqual(1);
        expect(results).toEqual([service.createResult(doc3, infomap1)]);
      });
    });
  });
});
