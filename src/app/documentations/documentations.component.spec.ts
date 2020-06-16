import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, mockService } from '../../utils/test-helpers';
import { DocumentationsComponent } from 'app/documentations/documentations.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Article, Link } from 'edc-client-js';
import { Doc } from 'app/documentations/documentation';

import { of } from 'rxjs';
import { ConfigService } from '../config.service';
import { DocumentationsService } from './documentations.service';
import { Store } from '@ngrx/store';

@Pipe({name: 'html'})
class StubHtmlPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {}
}

describe('DocumentationsComponent', () => {
  let component: DocumentationsComponent;
  let fixture: ComponentFixture<DocumentationsComponent>;
  let store: Store<any>;
  let configService: ConfigService;
  let documentationsService: DocumentationsService;
  const documentation = mock(Doc, {id: 1, content: 'content'});


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DocumentationsComponent,
        StubHtmlPipe
      ],
      providers: [
        mockService(Store, ['select']),
        mockService(ConfigService, ['getConfiguration']),
        mockService(DocumentationsService, ['getDocumentation'])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    configService = TestBed.get(ConfigService);
    store = TestBed.get(Store);
    documentationsService = TestBed.get(DocumentationsService);
    spyOn(store, 'select').and.returnValue(of(documentation));
    spyOn(documentationsService, 'getDocumentation').and.returnValue(of(documentation));
    spyOn(configService, 'getConfiguration').and.returnValue({displayFirstDocInsteadOfToc: false});

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
        component.documentation.links = [mock(Link, {id: 1})];
        expect(component.showLinksbar()).toBeTruthy();
      });

      it('should show link bar if articles are not empty', () => {
        component.documentation.articles = [mock(Article, {id: 1})];
        expect(component.showLinksbar()).toBeTruthy();
      });

      it('should show link bar if links and articles are not empty', () => {
        component.documentation.links = [mock(Link, {id: 1})];
        component.documentation.articles = [mock(Article, {id: 1})];
        expect(component.showLinksbar()).toBeTruthy();
      });
    });
  });
});
