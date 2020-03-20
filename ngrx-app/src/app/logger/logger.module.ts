import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { loggerFeatureKey, loggerReducer } from './store';
import { LoggerComponent } from './logger.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(loggerFeatureKey, loggerReducer),
  ],
  declarations: [LoggerComponent],
  exports: [LoggerComponent]
})
export class LoggerModule {}
