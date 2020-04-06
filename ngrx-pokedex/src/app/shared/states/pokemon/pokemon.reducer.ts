import { Action, createReducer, on } from '@ngrx/store';
import { PokemonState, pokemonAdapter } from './pokemon.adapter';

import { actions as PokemonActions } from './pokemon.actions';

export function pokemonInitialState(): PokemonState {
  return pokemonAdapter.getInitialState();
}

const pokemonReducer = createReducer(
  pokemonInitialState(),
  on(PokemonActions.loadPokemonSuccess, (state, { pokemons }) =>
    pokemonAdapter.addAll(pokemons, state)
  ),
  on(PokemonActions.addSuccess, (state, { pokemon }) =>
    pokemonAdapter.addOne(pokemon, state)
  ),
  on(PokemonActions.removeSuccess, (state, { id }) =>
    pokemonAdapter.removeOne(id, state)
  ),
  on(PokemonActions.updateSuccess, (state, { pokemon }) =>
    pokemonAdapter.updateOne({ id: pokemon.id, changes: pokemon }, state)
  )
);

export function reducer(state: PokemonState | undefined, action: Action) {
  return pokemonReducer(state, action);
}
