import { TestBed } from '@angular/core/testing';
import { HelpActions, DocumentationAction } from './help.actions';
import { mockService, mock } from '../../../utils/test-helpers';
import { Store } from '@ngrx/store';
import { Doc } from '../../documentations/documentation';

describe('help actions', () => {
  let helpActions: HelpActions;
  let store: Store<any>;

  const documentation = mock(Doc, {id: 1});

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HelpActions,
        mockService(Store, ['dispatch', 'select'])
      ]
    });

    helpActions = TestBed.get(HelpActions);
    store = TestBed.get(Store);
  });

  describe('update', () => {
    it('should update the current documentation', () => {
      spyOn(store, 'dispatch');

      helpActions.updateDocumentation(documentation);

      expect(store.dispatch).toHaveBeenCalledWith(new DocumentationAction(documentation));
    });

  });
});
