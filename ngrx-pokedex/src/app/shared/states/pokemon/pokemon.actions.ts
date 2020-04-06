import { createAction, props } from '@ngrx/store';

import { Pokemon } from '@models/pokemon.interface';

export enum PokemonActionTypes {
  ADD = '[Pokemon] Add',
  ADD_SUCCESS = '[Pokemon] Add success',
  ADD_FAILED = '[Pokemon] Add failed',
  LOAD_POKEMONS = '[Pokemon] Load pokemon',
  LOAD_POKEMONS_SUCCESS = '[Pokemon] Load pokemon success',
  LOAD_POKEMONS_FAILED = '[Pokemon] Load pokemon failed',
  UPDATE = '[Pokemon] Update',
  UPDATE_SUCCESS = '[Pokemon] Update success',
  UPDATE_FAILED = '[Pokemon] Update failed',
  REMOVE = '[Pokemon] Delete',
  REMOVE_SUCCESS = '[Pokemon] Delete success',
  REMOVE_FAILED = '[Pokemon] Delete failed'
}

export const actions = {
  loadPokemon: createAction(PokemonActionTypes.LOAD_POKEMONS),
  loadPokemonSuccess: createAction(
    PokemonActionTypes.LOAD_POKEMONS_SUCCESS,
    props<{ pokemons: Pokemon[] }>()
  ),
  loadPokemonFailed: createAction(
    PokemonActionTypes.LOAD_POKEMONS_FAILED,
    props<{ message: string }>()
  ),
  add: createAction(PokemonActionTypes.ADD, props<{ pokemon: Pokemon }>()),
  addSuccess: createAction(
    PokemonActionTypes.ADD_SUCCESS,
    props<{ pokemon: Pokemon }>()
  ),
  addFailed: createAction(
    PokemonActionTypes.ADD_FAILED,
    props<{ message: string }>()
  ),
  remove: createAction(PokemonActionTypes.REMOVE, props<{ id: number }>()),
  removeSuccess: createAction(
    PokemonActionTypes.REMOVE_SUCCESS,
    props<{ id: number }>()
  ),
  removeFailed: createAction(
    PokemonActionTypes.REMOVE_FAILED,
    props<{ message: string }>()
  ),
  update: createAction(
    PokemonActionTypes.UPDATE,
    props<{ pokemon: Pokemon }>()
  ),
  updateSuccess: createAction(
    PokemonActionTypes.UPDATE_SUCCESS,
    props<{ pokemon: Pokemon }>()
  ),
  updateFailed: createAction(
    PokemonActionTypes.UPDATE_FAILED,
    props<{ message: string }>()
  )
};
