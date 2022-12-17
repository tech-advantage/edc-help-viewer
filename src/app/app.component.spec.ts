/* tslint:disable:no-unused-variable */

import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HelpService } from './help/help.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockService } from '../utils/test-helpers';
import { ConfigService } from './config.service';
import { LeftSideBarSharedService } from './left-sidebar/left-sidebar-shared.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        mockService(HelpService, ['getResource']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(LeftSideBarSharedService, [], ['collapse', 'overlayMode']),
      ],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getConfiguration').and.returnValue({ images: { favicon: 'myFaviconUrl' } });
    fixture.detectChanges();
  });

  it('should create the app', waitForAsync(() => {
    const app: AppComponent = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
