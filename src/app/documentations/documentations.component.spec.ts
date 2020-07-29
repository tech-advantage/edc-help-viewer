import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, mockService } from '../../utils/test-helpers';
import { DocumentationsComponent } from 'app/documentations/documentations.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, Renderer2 } from '@angular/core';
import { Article, Link } from 'edc-client-js';
import { Doc } from 'app/documentations/documentation';

import { of } from 'rxjs';
import { ConfigService } from '../config.service';
import { DocumentationsService } from './documentations.service';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import * as ScreenFuncs from '../../utils/global-helper';
import { WindowRefService } from '../window-ref.service';

@Pipe({ name: 'html' })
class StubHtmlPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  transform(value: unknown, ...args: unknown[]): void {}
}

describe('DocumentationsComponent', () => {
  let component: DocumentationsComponent;
  let fixture: ComponentFixture<DocumentationsComponent>;
  let store: Store<unknown>;
  let configService: ConfigService;
  let documentationsService: DocumentationsService;
  let windowRefService: WindowRefService;
  const documentation = mock(Doc, { id: 1, content: 'content' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentationsComponent, StubHtmlPipe],
      providers: [
        mockService(Store, ['select']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(DocumentationsService, ['getDocumentation']),
        WindowRefService,
        Location,
        Renderer2,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    configService = TestBed.inject(ConfigService);
    store = TestBed.inject(Store);
    documentationsService = TestBed.inject(DocumentationsService);
    windowRefService = TestBed.inject(WindowRefService);
    spyOn(store, 'select').and.returnValue(of(documentation));
    spyOn(documentationsService, 'getDocumentation').and.returnValue(of(documentation));
    spyOn(configService, 'getConfiguration').and.returnValue({ displayFirstDocInsteadOfToc: false });

    spyOn(ScreenFuncs, 'getWindowSize').and.returnValue(ScreenFuncs.ScreenSize.LG);

    fixture = TestBed.createComponent(DocumentationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
    expect(component.documentation).toEqual(documentation);
  }));

  describe('runtime', () => {
    describe('show link bar', () => {
      it('should dont show link bar', () => {
        component.documentation.links = [];
        component.documentation.articles = [];
        expect(component.showLinksbar()).toBeFalsy();
      });

      it('should show link bar if links are not empty', () => {
        component.documentation.links = [mock(Link, { id: 1 })];
        expect(component.showLinksbar()).toBeTruthy();
      });

      it('should show link bar if articles are not empty', () => {
        component.documentation.articles = [mock(Article, { id: 1 })];
        expect(component.showLinksbar()).toBeTruthy();
      });

      it('should show link bar if links and articles are not empty', () => {
        component.documentation.links = [mock(Link, { id: 1 })];
        component.documentation.articles = [mock(Article, { id: 1 })];
        expect(component.showLinksbar()).toBeTruthy();
      });
    });
  });

  describe('handle responsive', () => {
    it('should collapse if screen is too small (mobile)', () => {
      spyOn(ScreenFuncs, 'isMobile').and.returnValue(true);

      const doc = new DocumentationsComponent(null, null, null, windowRefService);
      expect(doc.showSidebar).not.toBeTruthy();
      expect(doc.overlayMode).toBeTruthy();
    });

    it('should not collapse if screen is big enough', () => {
      spyOn(ScreenFuncs, 'isMobile').and.returnValue(false);

      const doc = new DocumentationsComponent(null, null, null, windowRefService);
      expect(doc.showSidebar).toBeTruthy();
      expect(doc.overlayMode).not.toBeTruthy();
    });
  });
});
