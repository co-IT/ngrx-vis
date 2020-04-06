import * as PokemonSelectors from '@states/pokemon/pokemon.selector';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppStore } from '@shared/interfaces/store.interface';
import { Observable } from 'rxjs';
import { Pokemon } from '@shared/interfaces/pokemon.interface';
import { actions as PokemonActions } from '@states/pokemon/pokemon.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonComponent {
  public pokemon: Pokemon = {} as Pokemon;
  public pokemons$: Observable<any> = this.store$.select(
    PokemonSelectors.selectAll
  );
  public onDelete({ id }: Pokemon) {
    this.store$.dispatch(PokemonActions.remove({ id }));
  }
  public onSelect(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  public onUpdate(pokemon: Pokemon) {
    this.store$.dispatch(PokemonActions.update({ pokemon }));
  }
  public onAdd(pokemon: Pokemon) {
    this.store$.dispatch(PokemonActions.add({ pokemon }));
  }
  constructor(private store$: Store<AppStore>) {
    this.store$.dispatch(PokemonActions.loadPokemon());
  }
}
