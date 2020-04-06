import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Pokemon } from '@shared/interfaces/pokemon.interface';
import { actions as PokemonActions } from '@states/pokemon/pokemon.actions';
import { PokemonService } from '@services/pokemon.service';
import { of } from 'rxjs';

@Injectable()
export class PokemonEffects {
  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    public snackBar: MatSnackBar
  ) {}

  POKEMON_ACTIONS_SUCCESS = [
    PokemonActions.addSuccess,
    PokemonActions.updateSuccess,
    PokemonActions.removeSuccess,
    PokemonActions.loadPokemonSuccess
  ];

  POKEMON_ACTIONS_FAILED = [
    PokemonActions.addFailed,
    PokemonActions.updateFailed,
    PokemonActions.removeFailed,
    PokemonActions.loadPokemonFailed
  ];

  loadAllPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemon),
      switchMap(() =>
        this.pokemonService.getAll().pipe(
          map(pokemons => PokemonActions.loadPokemonSuccess({ pokemons })),
          catchError(message =>
            of(PokemonActions.loadPokemonFailed({ message }))
          )
        )
      )
    )
  );

  addPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.add),
      switchMap((action: any) =>
        this.pokemonService.add(action.pokemon).pipe(
          map((pokemon: Pokemon) => PokemonActions.addSuccess({ pokemon })),
          catchError(message => of(PokemonActions.addFailed({ message })))
        )
      )
    )
  );

  deletePokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.remove),
      switchMap(({ id }) =>
        this.pokemonService.delete(id).pipe(
          map(() => PokemonActions.removeSuccess({ id })),
          catchError(message => of(PokemonActions.removeFailed({ message })))
        )
      )
    )
  );

  updatePokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.update),
      switchMap(({ pokemon }) =>
        this.pokemonService.update(pokemon).pipe(
          map(() => PokemonActions.updateSuccess({ pokemon })),
          catchError(message => of(PokemonActions.updateFailed(message)))
        )
      )
    )
  );

  successNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(...this.POKEMON_ACTIONS_SUCCESS),
        tap(() =>
          this.snackBar.open('SUCCESS', 'Operation success', {
            duration: 2000
          })
        )
      ),
    { dispatch: false }
  );

  failedNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(...this.POKEMON_ACTIONS_FAILED),
        tap(() =>
          this.snackBar.open('FAILED', 'Operation failed', {
            duration: 2000
          })
        )
      ),
    { dispatch: false }
  );
}
