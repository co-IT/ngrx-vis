import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { count, randomAdd, substract } from './store';
import { logInfo } from '../logger/store';

@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <div class="count">{{ count | async }}</div>
      <div class="counter-actions">
        <button (click)="add()">Add Random</button>
        <button (click)="substract(5)">Substract 5</button>
      </div>
    </div>`,
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  count: Observable<number>;

  constructor(private store: Store) {
    this.count = this.store.pipe(select(count))
  }

  add() {
    this.store.dispatch(randomAdd());
  }

  substract(value: number) {
    this.store.dispatch(substract(value));
  }
}