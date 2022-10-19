import { TestBed, waitForAsync } from '@angular/core/testing';
import { HelpService } from './help.service';
import { ExportInfo } from 'edc-client-js';
import { mockService, mock } from '../../utils/test-helpers';
import { ConfigService } from '../config.service';

describe('HelpService', () => {
  let helpService: HelpService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelpService, mockService(ConfigService, ['getConfiguration'])],
    });

    helpService = TestBed.inject(HelpService);
    configService = TestBed.inject(ConfigService);
  });

  beforeEach(() => {
    spyOn(configService, 'getConfiguration').and.returnValue({
      docPath: '/doc',
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
      collapseTocAsDefault: false,
      displayFirstDocInsteadOfToc: false,
      fullHeightRightSidebarOnMobile: false
     });
  });

  it('should init with pluginId as undefined', () => {
    helpService.connect();
    // edcClient base url should have been set to '/doc'
    expect(helpService.edcClient).toBeDefined();
    expect(helpService.getI18nUrl()).toBeDefined();
  });

  describe('runtime', () => {
    it('should get context help', waitForAsync(() => {
      spyOn(helpService.edcClient, 'getHelper').and.returnValue(Promise.resolve(helpService.edcClient.getHelper('key', 'subKey', 'pluginId', 'en')));

      helpService.getContextHelp('foo', 'bar', 'pluginId', 'en').subscribe();

      expect(helpService.edcClient.getHelper).toHaveBeenCalledWith('foo', 'bar', 'pluginId', 'en');
    }));

    it('should get current content', waitForAsync(() => {
      spyOn(helpService.edcClient, 'getContent').and.returnValue(
        Promise.resolve(mock(ExportInfo, { pluginId: 'myExportId', currentLanguage: 'fr' }))
      );
      helpService.getContent().subscribe((exportInfo: ExportInfo) => {
        expect(exportInfo.pluginId).toEqual('myExportId');
        expect(exportInfo.currentLanguage).toEqual('fr');
      });
    }));
  });
});
