import { GlossaryBarComponent } from './glossary-bar.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DocumentationsService } from '../documentations.service';
import { mock, mockService } from '../../../utils/test-helpers';
import { Doc } from '../documentation';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { LeftSideBarSharedService } from '../../left-sidebar/left-sidebar-shared.service';

import { of } from 'rxjs';
import { WindowRefService } from '../../window-ref.service';

@Pipe({ name: 'html' })
class MockHtmlPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  transform(): void {}
}

describe('GlossaryBarComponent ', () => {
  let component: GlossaryBarComponent;
  let fixture: ComponentFixture<GlossaryBarComponent>;
  let documentationsService: DocumentationsService;
  const documentation = mock(Doc, { id: 1 });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlossaryBarComponent, MockHtmlPipe],
      providers: [
        mockService(DocumentationsService, ['getDocumentation']),
        mockService(LeftSideBarSharedService, ['isCollapsed', 'getGlossaryContainerClasses']),
        WindowRefService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    documentationsService = TestBed.get(DocumentationsService);
    spyOn(documentationsService, 'getDocumentation').and.returnValue(of(documentation));

    fixture = TestBed.createComponent(GlossaryBarComponent);
    component = fixture.componentInstance;
    component._glossaryId = 1;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
    expect(component._glossaryId).toEqual(1);
  }));
});
