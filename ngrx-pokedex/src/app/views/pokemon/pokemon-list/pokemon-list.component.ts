import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Pokemon } from '@shared/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonListComponent {
  @Input() pokemons: any[] = [];
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public deletePokemon(pokemon: Pokemon) {
    this.delete.emit(pokemon);
  }
  public selectPokemon(pokemon: Pokemon) {
    this.select.emit(pokemon);
  }

  trackByFn(_, item) {
    return item.id;
  }
}
