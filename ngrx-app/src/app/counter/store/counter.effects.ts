import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, act } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { logInfo } from '../../logger/store';
import { add, randomAdd } from './counter.actions';

@Injectable()
export class CounterEffects {
  randomAdd = createEffect(() =>
    this.actions.pipe(
      ofType(randomAdd),
      concatMap(() =>
        randomizedNumber().pipe(
          map(value => add({ payload: { value } })),
          catchError(message => of(logInfo(message)))
        )
      )
    )
  );

  constructor(private actions: Actions) {}
}

function randomizedNumber(): Observable<number> {
  const value = Math.floor(Math.random() * 10);

  if (value > 5) {
    return throwError(
      `Generated number should not be greater than 5 (was ${value})`
    );
  }

  return of(value || 1);
}
