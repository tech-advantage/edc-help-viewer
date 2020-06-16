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

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let helpService: HelpService;
  let titleService: Title;
  let configService: ConfigService;
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
        mockService(LeftSideBarSharedService, ['toggleCollapseValue'])
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    helpService = TestBed.get(HelpService);
    titleService = TestBed.get(Title);
    configService = TestBed.get(ConfigService);
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
});
