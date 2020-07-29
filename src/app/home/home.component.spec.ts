import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { mockService } from '../../utils/test-helpers';
import { HelpService } from '../help/help.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { of } from 'rxjs';

describe('Home Component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let helpService: HelpService;
  let translateService: TranslateService;

  const title = 'foo';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [mockService(HelpService, ['getTitle']), mockService(TranslateService, ['get'])],
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
    spyOn(helpService, 'getTitle').and.returnValue(of(title));
    spyOn(translateService, 'get').and.returnValue(of(title));
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
