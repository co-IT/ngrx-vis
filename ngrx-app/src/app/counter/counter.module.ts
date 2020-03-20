import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { counterFeatureKey, CounterEffects, counterReducer } from './store';

import { CounterComponent } from './counter.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(counterFeatureKey, counterReducer),
    EffectsModule.forFeature([CounterEffects])
  ],
  declarations: [CounterComponent],
  exports: [CounterComponent]
})
export class CounterModule {}
