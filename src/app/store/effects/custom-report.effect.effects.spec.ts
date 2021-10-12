import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CustomReport.EffectEffects } from './custom-report.effect.effects';

describe('CustomReport.EffectEffects', () => {
  let actions$: Observable<any>;
  let effects: CustomReport.EffectEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomReport.EffectEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CustomReport.EffectEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
