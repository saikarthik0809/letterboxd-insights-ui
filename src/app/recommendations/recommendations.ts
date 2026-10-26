import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WatchlistApi } from '../services/watchlist-api';

interface Recommendation {
  tmdbId: number;
  title: string;
  year: number | null;
  posterPath: string | null;
  overview: string | null;
  tmdbRating: number | null;
  genres: string[];
  director: string | null;
  score: number;
  because: string[];
  reasons: string[];
}

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.css'
})
export class Recommendations implements OnInit {
  private http = inject(HttpClient);
  watchlist = inject(WatchlistApi);

  recs = signal<Recommendation[]>([]);
  loading = signal(false);
  error = signal(false);
  addingId = signal<number | null>(null);

  ngOnInit() {
    this.load();
    this.watchlist.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(false);
    this.http.get<Recommendation[]>('http://localhost:8080/api/recommendations').subscribe({
      next: data => {
        this.recs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  addToWatchlist(r: Recommendation) {
    this.addingId.set(r.tmdbId);
    this.watchlist.add({
      tmdbId: r.tmdbId,
      title: r.title,
      year: r.year,
      posterPath: r.posterPath
    }).subscribe({
      next: () => this.addingId.set(null),
      error: () => this.addingId.set(null)
    });
  }

  posterUrl(path: string | null) {
    return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
  }

  tmdbLink(id: number) {
    return `https://www.themoviedb.org/movie/${id}`;
  }
}