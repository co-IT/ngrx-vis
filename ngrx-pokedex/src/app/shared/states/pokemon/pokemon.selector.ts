import { PokemonState, pokemonAdapter } from './pokemon.adapter';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectPokemonState = createFeatureSelector<PokemonState>(
  'pokemon'
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = pokemonAdapter.getSelectors(selectPokemonState);
