import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PokemonEffects } from '@states/pokemon/pokemon.effects';
import { PokemonService } from '@services/pokemon.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './shared/states/root.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([PokemonEffects])
  ],
  providers: [PokemonService],
  exports: []
})
export class CoreModule {}
