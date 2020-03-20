import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { CounterModule } from './counter/counter.module';
import { LoggerModule } from './logger/logger.module';



@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictActionImmutability: true,
          strictActionSerializability: true,
          strictStateImmutability: true,
          strictStateSerializability: true
        }
      }
    ),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([]),

    CounterModule,
    LoggerModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
