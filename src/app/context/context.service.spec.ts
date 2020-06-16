import { TestBed } from '@angular/core/testing';
import { mockService } from '../../utils/test-helpers';
import { ContextService } from 'app/context/context.service';
import { HelpService } from 'app/help/help.service';

describe('ContextService', () => {
  let contextService: ContextService;
  let helpService: HelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContextService,
        mockService(HelpService, ['getContextHelp'])
      ]
    });
  });

  beforeEach(() => {
    contextService = TestBed.get(ContextService);
    helpService = TestBed.get(HelpService);
  });

  describe('runtime', () => {
    it('should get context help', () => {
      spyOn(helpService, 'getContextHelp');
      contextService.getArticle('key', 'subKey', 'pluginId', 'en');
      expect(helpService.getContextHelp).toHaveBeenCalledWith('key', 'subKey', 'pluginId', 'en');
    });
  });

});
