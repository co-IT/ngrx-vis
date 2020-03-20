import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { selectAll, hasMessages, Message } from './store';

@Component({
  selector: 'app-logger',
  template: `
    <h2 *ngIf="hasMessages | async">Log</h2>

    <ul>
      <li *ngFor="let message of (messages | async)">{{ message.text }}</li>
    </ul>
  `,
  styles: [
    `
      :host {
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      h2 {
        margin-top: 3rem;
      }
    `
  ]
})
export class LoggerComponent {
  messages: Observable<Message[]>;
  hasMessages: Observable<boolean>;

  constructor(private store: Store) {
    this.messages = this.store.pipe(select(selectAll));
    this.hasMessages = this.store.pipe(select(hasMessages));
  }
}
