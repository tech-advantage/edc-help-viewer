/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { HelpService } from 'app/help/help.service';
import { HelpActions } from 'app/ngrx/actions/help.actions';
import { of } from 'rxjs';
import { mock, mockService } from '../../utils/test-helpers';
import { HomeResolve } from './home.resolve';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { ExportInfo } from 'edc-client-js';
import { LANG_PARAM, PLUGIN_PARAM } from 'app/context/context.constants';

describe('homeResolve', () => {
  let helpService: HelpService;
  let helpActions: HelpActions;
  let store: Store<AppState>;
  let homeResolve: HomeResolve;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeResolve,
        mockService(HelpService, ['connect', 'getContent', 'advanced']),
        mockService(Store, ['select']),
        mockService(HelpActions, ['setDocumentationLanguage', 'setExportId']),
        mockService(ActivatedRouteSnapshot, ['params']),
      ],
    });

    helpService = TestBed.inject(HelpService);
    helpActions = TestBed.inject(HelpActions);
    homeResolve = TestBed.inject(HomeResolve);
    route = TestBed.inject(ActivatedRouteSnapshot);
    store = TestBed.inject(Store) as Store<AppState>;
  });

  beforeEach(() => {
    spyOn(helpActions, 'setDocumentationLanguage');
    spyOn(helpActions, 'setExportId');
    spyOn(helpService, 'connect');
  });

  describe('resolve', () => {
    it('params empty', () => {
      const task = homeResolve.resolve(route);

      expect(helpService.connect).not.toHaveBeenCalled();
      expect(helpActions.setDocumentationLanguage).toHaveBeenCalled();
      expect(helpActions.setExportId).toHaveBeenCalled();
      expect(task).toBeDefined();
      task.subscribe((res) => expect(res).toBeNull());
    });
    it('params not empty case equal current', () => {
      route = mock(ActivatedRouteSnapshot, convertToParamMap({ [PLUGIN_PARAM]: 'pluginid', [LANG_PARAM]: 'en' }));
      spyOn(helpService, 'getContent').and.returnValue(
        of(mock(ExportInfo, { pluginId: 'pluginid', currentLanguage: 'en' }))
      );
      spyOn(store, 'select').and.returnValue(of('pluginid'));

      const task = homeResolve.resolve(route);

      expect(helpService.connect).not.toHaveBeenCalled();
      expect(store.select).toHaveBeenCalled();
      expect(helpActions.setDocumentationLanguage).toHaveBeenCalled();
      expect(helpActions.setExportId).toHaveBeenCalledWith('pluginid');
      expect(task).toBeDefined();
      task.subscribe((res) => expect(res).toBeNull());
    });
    it('params not empty case not equal current', () => {
      route = mock(ActivatedRouteSnapshot, convertToParamMap({ [PLUGIN_PARAM]: 'dinigulp', [LANG_PARAM]: 'en' }));
      spyOn(helpService, 'getContent').and.returnValue(
        of(mock(ExportInfo, { pluginId: 'dinigulp', currentLanguage: 'en' }))
      );
      spyOn(store, 'select').and.returnValue(of('pluginid'));

      const result = homeResolve.resolve(route);

      expect(store.select).toHaveBeenCalled();
      expect(route.params[PLUGIN_PARAM]).toEqual('dinigulp');
      expect(route.params[LANG_PARAM]).toEqual('en');
      expect(helpService.connect).toHaveBeenCalledWith('dinigulp', 'en');
      expect(helpActions.setDocumentationLanguage).toHaveBeenCalled();
      expect(helpActions.setExportId).toHaveBeenCalledWith('dinigulp');
      expect(result).toBeDefined();
      result.subscribe((res) => expect(res).toBeNull());
    });
  });
});
