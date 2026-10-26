import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface WatchlistItem {
  id: number;
  tmdbId: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  addedDate: string;
}

export interface NewWatchlistFilm {
  tmdbId: number;
  title: string;
  year: number | null;
  posterPath: string | null;
}

const API = 'http://localhost:8080/api/watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistApi {
  private http = inject(HttpClient);

  // Shared by every page that uses the watchlist
  items = signal<WatchlistItem[]>([]);
  tmdbIds = computed(() => new Set(this.items().map(i => i.tmdbId)));

  load() {
    this.http.get<WatchlistItem[]>(API).subscribe(data => this.items.set(data));
  }

  add(film: NewWatchlistFilm): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(API, film).pipe(
      tap(item => this.items.update(list => [item, ...list]))
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`).pipe(
      tap(() => this.items.update(list => list.filter(i => i.id !== id)))
    );
  }

  markWatched(id: number, rating: number | null): Observable<unknown> {
    return this.http.post(`${API}/${id}/watched`, { rating }).pipe(
      tap(() => this.items.update(list => list.filter(i => i.id !== id)))
    );
  }
}