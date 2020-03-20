import { EntityState } from '@ngrx/entity';

export interface Message {
  id: string;
  text: string;
}

export interface LoggerState extends EntityState<Message> {}
