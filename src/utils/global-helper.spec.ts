import { lowerDeburr, trimAndLower, unsubscribe } from './global-helper';

import { Subscription } from 'rxjs';

describe('Glocal helper test', () => {

  describe('lowerDeburr', () => {
    it('should process lower and deburr', () => {
      expect(lowerDeburr('TÉst')).toEqual('test');
      expect(lowerDeburr('ôéèà')).toEqual('oeea');
      expect(lowerDeburr('MAJUSCULES')).toEqual('majuscules');
      expect(lowerDeburr('minuscules')).toEqual('minuscules');
    });
  });

  describe('trim and lower', () => {
    it('should process trim and toLower', () => {
      expect(trimAndLower('    TÉst    ')).toEqual('tést');
      expect(trimAndLower('__  ôéèAà __')).toEqual('__  ôéèaà __');
      expect(trimAndLower('MAJUSCULES')).toEqual('majuscules');
      expect(trimAndLower('minuscules')).toEqual('minuscules');
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

      unsubscribe([subscription1, subscription2]);

      expect(subscription1.closed).toBeTruthy();
      expect(subscription2.closed).toBeTruthy();
    });

    it('should unsubscribe if only one subscription', () => {

      expect(subscription1.closed).toBeFalsy();

      unsubscribe(subscription1);

      expect(subscription1.closed).toBeTruthy();
    });

    it('should not crash if one value is undefined', () => {
      unsubscribe([subscription1, undefined]);
    });

    it('should not crash if only value is undefined', () => {
      unsubscribe(undefined);
    });
  });

});
