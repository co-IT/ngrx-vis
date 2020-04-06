import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon } from '@shared/interfaces/pokemon.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  constructor(private http: HttpClient) {}

  public getAll(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(environment.backendUrl);
  }

  public delete(id: number): Observable<Pokemon> {
    return this.http.delete<Pokemon>(`${environment.backendUrl}/${id}`);
  }

  public add(pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(environment.backendUrl, pokemon);
  }

  public update(pokemon: Partial<Pokemon>): Observable<Pokemon> {
    return this.http.put<Pokemon>(`${environment.backendUrl}`, pokemon);
  }
}
