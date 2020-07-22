import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TreeComponent } from './tree.component';
import { mock } from '../../../utils/test-helpers';
import { RouterTestingModule } from '@angular/router/testing';
import { HelpDocumentation } from '../../../global/classes/help-documentation';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.depth).toBe(0);
  });

  describe('runtime', () => {
    describe('padding', () => {
      it('should have the correct padding for depth 0 without topics', () => {
        component.depth = 0;
        const doc = mock(HelpDocumentation, { topics: [] });
        expect(component.getPadding(doc)).toBe('30px');
      });

      it('should have the correct padding for depth 0 with topics', () => {
        component.depth = 0;
        const doc = mock(HelpDocumentation, { topics: [{ foo: 'bar' }] });
        expect(component.getPadding(doc)).toBe('10px');
      });
      it('should have the correct padding for depth 3 without topics', () => {
        component.depth = 3;
        const doc = mock(HelpDocumentation, { topics: [] });
        expect(component.getPadding(doc)).toBe('75px');
      });

      it('should have the correct padding for depth 3 with topics', () => {
        component.depth = 3;
        const doc = mock(HelpDocumentation, { topics: [{ foo: 'bar' }] });
        expect(component.getPadding(doc)).toBe('55px');
      });
    });

    describe('has topics', () => {
      it('should have topics', () => {
        const doc = mock(HelpDocumentation, { topics: [{ foo: 'bar' }] });
        expect(component.hasTopics(doc)).toBeTruthy();
      });
      it('should not have topics', () => {
        const doc = mock(HelpDocumentation, { topics: [] });
        expect(component.hasTopics(doc)).toBeFalsy();
      });
    });

    describe('toggle doc collapse', () => {
      it('should toggle doc collapse', () => {
        const doc = mock(HelpDocumentation);
        doc.$isCollapsed = false;

        component.toggleCollapse(new MouseEvent(''), doc);

        expect(doc.$isCollapsed).toBeTruthy();
      });
    });

    describe('is doc collapsed', () => {
      it('should not be collapsed', () => {
        const doc = mock(HelpDocumentation);
        doc.$isCollapsed = false;

        expect(component.isCollapsed(doc)).toBeFalsy();
      });
      it('should be collapsed', () => {
        const doc = mock(HelpDocumentation);
        doc.$isCollapsed = true;

        expect(component.isCollapsed(doc)).toBeTruthy();
      });
      it('should not be collapsed if depth < 3', () => {
        const doc = mock(HelpDocumentation);
        component.depth = 2;

        expect(component.isCollapsed(doc)).toBeFalsy();
      });
    });

    describe('isVisible', () => {
      let doc: HelpDocumentation;

      beforeEach(() => {
        doc = mock(HelpDocumentation);
      });

      it('should return true if documentation label matches query', () => {
        component.searchResultIds = [5, 7];
        doc.$matchesSearch = true;

        const result = component.isVisible(doc);
        expect(result).toBeTruthy();
      });

      it('should return false if documentation label does NOT match and has no child', () => {
        component.searchResultIds = [5, 7];
        doc.$matchesSearch = false;
        doc.$isParentSearch = false;

        const result = component.isVisible(doc);
        expect(result).toBeFalsy();
      });

      it('should return true if documentation label does NOT match but if one child does', () => {
        component.searchResultIds = [5, 7];
        doc.$matchesSearch = false;
        doc.$isParentSearch = true;

        const result = component.isVisible(doc);
        expect(result).toBeTruthy();
      });

      it('should return true if searchResultIds has no value', () => {
        component.searchResultIds = [];
        doc.$matchesSearch = false;
        doc.$isParentSearch = false;

        const result = component.isVisible(doc);
        expect(result).toBeTruthy();
      });

      it('should return true if searchResultIds is null', () => {
        component.searchResultIds = null;
        doc.$matchesSearch = false;
        doc.$isParentSearch = false;

        const result = component.isVisible(doc);
        expect(result).toBeTruthy();
      });
    });
  });
});
