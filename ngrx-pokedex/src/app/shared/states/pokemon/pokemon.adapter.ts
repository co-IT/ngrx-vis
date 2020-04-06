import { EntityState } from '@ngrx/entity';
import { Pokemon } from '@shared/interfaces/pokemon.interface';
import { createEntityAdapter } from '@ngrx/entity';

export const pokemonAdapter = createEntityAdapter<Pokemon>();

export interface PokemonState extends EntityState<Pokemon> {}
