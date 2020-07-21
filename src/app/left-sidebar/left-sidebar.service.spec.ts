import { TestBed } from '@angular/core/testing';
import { LeftSidebarService } from 'app/left-sidebar/left-sidebar.service';
import { HelpInformationMap } from 'global/classes/help-information-map';
import { mock, mockService } from 'utils/test-helpers';
import { SearchDocResult } from 'app/left-sidebar/search-doc/search-doc-result';
import { HelpService } from 'app/help/help.service';
import { Documentation, InformationMap, Toc } from 'edc-client-js';

describe('LeftSidebarService test', () => {
  let leftSidebarService: LeftSidebarService;
  let helpService: HelpService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [LeftSidebarService, mockService(HelpService, ['getToc'])],
    })
  );

  beforeEach(() => {
    leftSidebarService = TestBed.get(LeftSidebarService);
    helpService = TestBed.get(HelpService);
  });

  describe('runtime', () => {
    describe('countResult', () => {
      let informationMap: HelpInformationMap;
      let results: SearchDocResult[];

      beforeEach(() => {
        informationMap = mock(HelpInformationMap, { id: 5 });
        results = [
          mock(SearchDocResult, { strategyId: 1 }),
          mock(SearchDocResult, { strategyId: 2 }),
          mock(SearchDocResult, { strategyId: '2' }),
          mock(SearchDocResult, { strategyId: 2 }),
        ];
      });

      it('should return 0 if no search doc result id match', () => {
        const resultsNumber = leftSidebarService.countResult(informationMap, results);

        expect(resultsNumber).toEqual(0);
      });

      it('should return 1 if 1 search doc result id matches', () => {
        informationMap.id = 1;

        const resultsNumber = leftSidebarService.countResult(informationMap, results);

        expect(resultsNumber).toEqual(1);
      });

      it('should return 3 if 3 search doc result id match', () => {
        informationMap.id = 2;

        const resultsNumber = leftSidebarService.countResult(informationMap, results);

        expect(resultsNumber).toEqual(3);
      });

      it('should return 0 if information map id is not defined', () => {
        informationMap.id = undefined;

        const resultsNumber = leftSidebarService.countResult(informationMap, results);

        expect(resultsNumber).toEqual(0);
      });

      it('should return 0 if information map id is not defined and one of the result strategyId value is undefined', () => {
        informationMap.id = undefined;
        results.push(mock(SearchDocResult, { strategyId: undefined }));

        const resultsNumber = leftSidebarService.countResult(informationMap, results);

        expect(resultsNumber).toEqual(0);
      });
    });

    describe('buildHelpInformationMaps', () => {
      let informationMaps: InformationMap[];
      let toc: Toc;

      beforeEach(() => {
        informationMaps = buildFakeInformationMaps();
        toc = mock(Toc, { toc: informationMaps });
      });

      it('should build and return the Help information maps in french', () => {
        const result = leftSidebarService.buildHelpInformationMaps(toc, 'fr');

        expect(result).toBeDefined();
        expect(result.length).toEqual(3);

        expect(result[0].label).toEqual('French InformationMap1 label');
        expect(result[0].id).toEqual(41);

        expect(result[1].label).toEqual('French InformationMap2 label');
        expect(result[1].id).toEqual(48);

        expect(result[2].label).toEqual('French InformationMap3 label');
        expect(result[2].id).toEqual(49);
      });

      it('should return an empty array if toc is null', () => {
        const result = leftSidebarService.buildHelpInformationMaps(null);
        expect(result).toBeDefined();
        expect(result.length).toEqual(0);
      });
    });

    describe('initToc', () => {
      let toc: Toc;

      beforeEach(() => {
        toc = mock(Toc, { label: 'monToc' });
      });

      beforeEach(() => {
        spyOn(leftSidebarService, 'buildHelpInformationMaps');
      });

      it('should init Toc building help information maps', () => {
        spyOn(helpService, 'getToc').and.returnValue(Promise.resolve(toc));

        leftSidebarService.initToc().subscribe(() => {
          expect(helpService.getToc).toHaveBeenCalledTimes(1);
          expect(leftSidebarService.buildHelpInformationMaps).toHaveBeenCalledTimes(1);
          expect(leftSidebarService.buildHelpInformationMaps).toHaveBeenCalledWith(toc, undefined);
        });
      });
      it('should return an empty array if couldn"t retrieve the toc', () => {
        spyOn(helpService, 'getToc').and.returnValue(Promise.reject(''));

        leftSidebarService.initToc().subscribe((ims) => {
          expect(helpService.getToc).toHaveBeenCalledTimes(1);
          expect(leftSidebarService.buildHelpInformationMaps).toHaveBeenCalledTimes(0);
          expect(ims).toEqual(new Array<HelpInformationMap>());
        });
      });
    });

    function buildFakeInformationMaps(): InformationMap[] {
      const doc1: Documentation = mock(Documentation, {
        id: 1,
        topics: [],
      });
      const doc2: Documentation = mock(Documentation, {
        id: 2,
        topics: [doc1],
      });
      const doc3: Documentation = mock(Documentation, {
        id: 3,
        topics: [],
      });
      const doc4: Documentation = mock(Documentation, {
        id: 4,
        topics: [],
      });
      const doc5: Documentation = mock(Documentation, {
        id: 5,
        topics: [doc4],
      });
      const doc6: Documentation = mock(Documentation, {
        id: 6,
        topics: [doc5],
      });
      const doc7: Documentation = mock(Documentation, {
        id: 7,
        topics: [doc2],
      });
      const doc8: Documentation = mock(Documentation, {
        id: 8,
      });

      const docs1: Documentation[] = [mock(Documentation, { topics: [doc3, doc6] })];
      const docs2: Documentation[] = [mock(Documentation, { topics: [doc7] })];
      const docs3: Documentation[] = [mock(Documentation, { topics: [doc8] })];

      return [
        mock(InformationMap, {
          id: 41,
          topics: docs1,
          en: { label: 'English InformationMap1 label' },
          fr: { label: 'French InformationMap1 label' },
        }),
        mock(InformationMap, {
          id: 48,
          topics: docs2,
          en: { label: 'English InformationMap2 label' },
          fr: { label: 'French InformationMap2 label' },
        }),
        mock(InformationMap, {
          id: 49,
          topics: docs3,
          en: { label: 'English InformationMap3 label' },
          fr: { label: 'French InformationMap3 label' },
        }),
      ];
    }
  });
});
