import { createAction } from '@ngrx/store';

// ⚠️ poorId is just for demo purposes.
// An action creator should not know about id generation.
let poorId = 0;

export const logInfo = createAction('[Logger] Log Info', (text: string) => ({
  payload: { id: `${poorId++}`, text }
}));
