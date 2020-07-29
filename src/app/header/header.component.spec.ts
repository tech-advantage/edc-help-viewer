/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';
import { mockService } from '../../utils/test-helpers';
import { HelpService } from '../help/help.service';
import { ConfigService } from '../config.service';
import { LeftSideBarSharedService } from '../left-sidebar/left-sidebar-shared.service';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { WindowRefService } from '../window-ref.service';
import * as ScreenFuncs from '../../utils/global-helper';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let helpService: HelpService;
  let titleService: Title;
  let configService: ConfigService;
  let windowRefService: WindowRefService;

  const title = 'foo';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        mockService(Title, ['setTitle']),
        mockService(HelpService, ['getTitle']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(Store, ['select']),
        mockService(LeftSideBarSharedService, ['toggleCollapseValue', 'isCollapsed']),
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        WindowRefService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    helpService = TestBed.inject(HelpService);
    titleService = TestBed.inject(Title);
    configService = TestBed.inject(ConfigService);
    windowRefService = TestBed.inject(WindowRefService);
    spyOn(helpService, 'getTitle').and.returnValue(of(title));
    spyOn(titleService, 'setTitle');
    spyOn(configService, 'getConfiguration').and.returnValue({ images: { logo_header: 'myLogoUrl' } });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.title).toBe(title);
    expect(titleService.setTitle).toHaveBeenCalledWith('foo');
  });

  describe('toggle left side bar collapse', () => {
    it('method should be called', () => {
      spyOn(component, 'toggleCollapseSideBar').and.returnValue(of(true));
      component.toggleCollapseSideBar();
      expect(component.toggleCollapseSideBar).toHaveBeenCalled();
    });
  });

  describe('initial value of left side bar collapse', () => {
    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it('should start collapsed if window is too small', () => {
      spyOn(ScreenFuncs, 'isMobile').and.returnValue(true);
      const leftBar = new LeftSideBarSharedService(windowRefService);
      jasmine.clock().tick(5);
      expect(leftBar.isCollapsed()).toBeTruthy();
      expect(leftBar.isInOverlayMode()).toBeTruthy();
    });

    it('should not start collapsed if default value is false', () => {
      spyOn(ScreenFuncs, 'getWindowSize').and.returnValue(ScreenFuncs.ScreenSize.LG);
      const leftBar = new LeftSideBarSharedService(windowRefService);
      jasmine.clock().tick(5);
      expect(leftBar.isCollapsed()).not.toBeTruthy();
      expect(leftBar.isInOverlayMode()).not.toBeTruthy();
    });
  });
});
