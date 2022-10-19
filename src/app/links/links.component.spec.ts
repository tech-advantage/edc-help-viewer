import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LinksComponent } from './links.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mockService, mock } from '../../utils/test-helpers';
import { Helper, Link } from 'edc-client-js';

describe('Links Component', () => {
  let component: LinksComponent;
  let fixture: ComponentFixture<LinksComponent>;
  let route;

  beforeEach(() => {
    route = mockService(ActivatedRoute);
    route.useClass.prototype.snapshot = {
      params: {
        index: 1,
      },
    };
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LinksComponent],
      providers: [route],
      imports: [RouterModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksComponent);
    component = fixture.componentInstance;
    component.linkable = mock(Helper);
    fixture.detectChanges();
  });

  describe('init', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.linkable).toBeTruthy();
      expect(component.params).toEqual({ index: 1 });
    });
  });

  describe('runtime', () => {
    it('should get article url', () => {
      component.params = {
        key: 'foo',
        subKey: 'bar',
        lang: 'baz',
      };

      expect(component.getArticleLink(1)).toBe('/context/foo/bar/baz/1');
    });

    it('should get link url', () => {
      const link = mock(Link, { id: 1 });

      expect(component.getLinkLink(link)).toBe('/doc/1');
    });
  });
});
