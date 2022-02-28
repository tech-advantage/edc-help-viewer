import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { mockService } from '../../utils/test-helpers';
import { HelpService } from '../help/help.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';
import { ConfigService } from 'app/config.service';

describe('Home Component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let helpService: HelpService;
  let translateService: TranslateService;
  let configService: ConfigService;

  const title = 'foo';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        mockService(HelpService, ['getTitle']),
        mockService(TranslateService, ['get']),
        mockService(ConfigService, ['getConfiguration']),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    helpService = TestBed.inject(HelpService);
    translateService = TestBed.inject(TranslateService);
    configService = TestBed.inject(ConfigService);
    spyOn(helpService, 'getTitle').and.returnValue(of(title));
    spyOn(translateService, 'get').and.returnValue(of(title));
    spyOn(configService, 'getConfiguration').and.returnValue({ documentationStylePath: '/assets/style/custom.css' });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', async(() => {
    expect(component).toBeTruthy();
    expect(component.title).toBe(title);
  }));
});
