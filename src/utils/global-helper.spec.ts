import { GlobalHelper, ScreenSize } from './global-helper';

import { Subscription } from 'rxjs';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Glocal helper test', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Window, useValue: window }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  describe('lowerDeburr', () => {
    it('should process lower and deburr', () => {
      expect(GlobalHelper.lowerDeburr('TÉst')).toEqual('test');
      expect(GlobalHelper.lowerDeburr('ôéèà')).toEqual('oeea');
      expect(GlobalHelper.lowerDeburr('MAJUSCULES')).toEqual('majuscules');
      expect(GlobalHelper.lowerDeburr('minuscules')).toEqual('minuscules');
    });
  });

  describe('trim and lower', () => {
    it('should process trim and toLower', () => {
      expect(GlobalHelper.trimAndLower('    TÉst    ')).toEqual('tést');
      expect(GlobalHelper.trimAndLower('__  ôéèAà __')).toEqual('__  ôéèaà __');
      expect(GlobalHelper.trimAndLower('MAJUSCULES')).toEqual('majuscules');
      expect(GlobalHelper.trimAndLower('minuscules')).toEqual('minuscules');
    });
  });

  describe('unsubscribe', () => {
    let subscription1, subscription2: Subscription;

    beforeEach(() => {
      subscription1 = new Subscription();
      subscription2 = new Subscription();
    });

    it('should unsubscribe from all subscriptions', () => {
      expect(subscription1.closed).toBeFalsy();
      expect(subscription2.closed).toBeFalsy();

      GlobalHelper.unsubscribe([subscription1, subscription2]);

      expect(subscription1.closed).toBeTruthy();
      expect(subscription2.closed).toBeTruthy();
    });

    it('should unsubscribe if only one subscription', () => {
      expect(subscription1.closed).toBeFalsy();

      GlobalHelper.unsubscribe(subscription1);

      expect(subscription1.closed).toBeTruthy();
    });

    it('should not crash if one value is undefined', () => {
      GlobalHelper.unsubscribe([subscription1, undefined]);
    });

    it('should not crash if only value is undefined', () => {
      GlobalHelper.unsubscribe(undefined);
    });
  });

  describe('get window size', () => {
    it('should return the correct ScreenSize from a very small screen', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(250);
      expect(GlobalHelper.getWindowSize(window)).toBe(ScreenSize.XS);
    });
    it('should return the correct ScreenSize from a small screen', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(600);
      expect(GlobalHelper.getWindowSize(window)).toBe(ScreenSize.SM);
    });
    it('should return the correct ScreenSize from a medium screen', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(800);
      expect(GlobalHelper.getWindowSize(window)).toBe(ScreenSize.MD);
    });
    it('should return the correct ScreenSize from a large screen', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1000);
      expect(GlobalHelper.getWindowSize(window)).toBe(ScreenSize.LG);
    });
    it('should return the correct ScreenSize from a very large screen', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(1400);
      expect(GlobalHelper.getWindowSize(window)).toBe(ScreenSize.XL);
    });
  });
});
