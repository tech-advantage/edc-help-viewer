import { TestBed, async } from '@angular/core/testing';
import { HelpService } from './help.service';
import { EdcClient, ExportInfo } from 'edc-client-js';
import { mockService, mock } from '../../utils/test-helpers';
import { ConfigService } from '../config.service';

describe('HelpService', () => {
  let helpService: HelpService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelpService, mockService(ConfigService, ['getConfiguration'])],
    });

    helpService = TestBed.get(HelpService);
    configService = TestBed.get(ConfigService);
  });

  beforeEach(() => {
    spyOn(configService, 'getConfiguration').and.returnValue({ docPath: '/doc' });
  });

  it('should init with pluginId as undefined', () => {
    helpService.connect();
    // edcClient base url should have been set to '/doc'
    expect(helpService.edcClient).toBeDefined();
    expect(helpService.getI18nUrl()).toBeDefined();
  });

  describe('runtime', () => {
    it('should get context help', async(() => {
      spyOn(helpService.edcClient, 'getHelper').and.returnValue(Promise.resolve());

      helpService.getContextHelp('foo', 'bar', 'pluginId', 'en').subscribe();

      expect(helpService.edcClient.getHelper).toHaveBeenCalledWith('foo', 'bar', 'pluginId', 'en');
    }));

    it('should get current content', async(() => {
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
