import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LoggerState } from './logger.state';
import { adapter } from './logger.reducer';

export const loggerFeatureKey = 'logger';

const featureLogger = createFeatureSelector<LoggerState>(loggerFeatureKey);

export const {
  selectAll,
  selectTotal,
  selectEntities,
  selectIds
} = adapter.getSelectors(featureLogger);

export const hasMessages = createSelector(
  selectTotal,
  total => total > 0
);
