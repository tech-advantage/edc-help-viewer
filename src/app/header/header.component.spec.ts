/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, Title } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';
import { mockService } from '../../utils/test-helpers';
import { HelpService } from '../help/help.service';
import { ConfigService } from '../config.service';
import { LeftSideBarSharedService } from '../left-sidebar/left-sidebar-shared.service';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {WindowRefService} from '../window-ref.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let helpService: HelpService;
  let titleService: Title;
  let configService: ConfigService;
  let windowRefService: WindowRefService;
  let store: Store<any>;

  const title = 'foo';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        mockService(Title, ['setTitle']),
        mockService(HelpService, ['getTitle']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(Store, ['select']),
        mockService(LeftSideBarSharedService, ['toggleCollapseValue', 'isCollapsed']),
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        WindowRefService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    helpService = TestBed.get(HelpService);
    titleService = TestBed.get(Title);
    configService = TestBed.get(ConfigService);
    windowRefService = TestBed.get(WindowRefService);
    store = TestBed.get(Store);
    spyOn(helpService, 'getTitle').and.returnValue(of(title));
    spyOn(titleService, 'setTitle');
    spyOn(configService, 'getConfiguration').and.returnValue({images: {logo_header: 'myLogoUrl'}});

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

    it('should start collapsed if default value is true', () => {
      spyOn(LeftSideBarSharedService.prototype, 'getDefaultValue').and.returnValue(true);
      const leftBar = new LeftSideBarSharedService(windowRefService);
      jasmine.clock().tick(5);
      expect(leftBar.getDefaultValue(window)).toBeTruthy();
      expect(leftBar.isCollapsed()).toBeTruthy();
    });

    it('should not start collapsed if default value is false', () => {
      spyOn(LeftSideBarSharedService.prototype, 'getDefaultValue').and.returnValue(false);
      const leftBar = new LeftSideBarSharedService(windowRefService);
      jasmine.clock().tick(5);
      expect(leftBar.getDefaultValue(window)).not.toBeTruthy();
      expect(leftBar.isCollapsed()).not.toBeTruthy();
    });
  });
});
