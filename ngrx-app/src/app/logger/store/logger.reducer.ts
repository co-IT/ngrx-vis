import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Message } from './logger.state';
import { logInfo } from './logger.actions';

export const adapter = createEntityAdapter<Message>();

export const loggerReducer = createReducer(
  adapter.getInitialState(),
  on(logInfo, (state, { payload }) => adapter.addOne(payload, state))
);
