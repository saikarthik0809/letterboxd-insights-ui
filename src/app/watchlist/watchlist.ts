import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WatchlistApi, WatchlistItem } from '../services/watchlist-api';

@Component({
  selector: 'app-watchlist',
  imports: [RouterLink],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.css'
})
export class Watchlist implements OnInit {
  watchlist = inject(WatchlistApi);

  message = signal('');
  busyId = signal<number | null>(null);

  ratingOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  ngOnInit() {
    this.watchlist.load();
  }

  posterUrl(path: string | null) {
    return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
  }

  remove(item: WatchlistItem) {
    this.busyId.set(item.id);
    this.watchlist.remove(item.id).subscribe({
      next: () => {
        this.message.set(`Removed "${item.title}"`);
        this.busyId.set(null);
      },
      error: () => {
        this.message.set('Could not remove it. Try again.');
        this.busyId.set(null);
      }
    });
  }

  markWatched(item: WatchlistItem, ratingValue: string) {
    const rating = ratingValue ? Number(ratingValue) : null;
    this.busyId.set(item.id);
    this.watchlist.markWatched(item.id, rating).subscribe({
      next: () => {
        this.message.set(`"${item.title}" moved to your films`);
        this.busyId.set(null);
      },
      error: () => {
        this.message.set('Could not save it. Try again.');
        this.busyId.set(null);
      }
    });
  }
}