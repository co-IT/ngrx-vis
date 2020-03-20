import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CounterState } from './counter.state';

export const counterFeatureKey = 'counter';

const visitCounter = createFeatureSelector<CounterState>(counterFeatureKey);

export const count = createSelector(
  visitCounter,
  s => s.count
);
