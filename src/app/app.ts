import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Film {
  id: number;
  name: string;
  year: number;
  letterboxdUri: string;
  rating: number | null;
  watchedDate: string | null;
  tmdbId: number | null;
  posterPath: string | null;
  overview: string | null;
  director: string | null;
  runtime: number | null;
  tmdbRating: number | null;
  genres: string[];
  enriched: boolean | null;
}

const API = 'http://localhost:8080/api/films';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);

  films = signal<Film[]>([]);
  uploading = signal(false);
  message = signal('');

  // TMDB progress
  enriching = signal(false);
  enrichDone = signal(0);
  enrichTotal = signal(0);

  needsDetails = computed(() => this.films().some(f => f.enriched == null));
  enrichPercent = computed(() =>
    this.enrichTotal() === 0 ? 0 : Math.round((this.enrichDone() / this.enrichTotal()) * 100)
  );

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms() {
    this.http.get<Film[]>(API).subscribe(data => this.films.set(data));
  }

  posterUrl(path: string | null) {
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.uploading.set(true);
    this.message.set('');

    this.http.post<{ imported: number }>(`${API}/upload`, formData).subscribe({
      next: res => {
        this.message.set(`Imported ${res.imported} films`);
        this.uploading.set(false);
        input.value = '';
        this.loadFilms();
      },
      error: () => {
        this.message.set('Upload failed. Check the file and try again.');
        this.uploading.set(false);
        input.value = '';
      }
    });
  }

  loadDetails() {
    this.enriching.set(true);
    this.enrichDone.set(0);
    this.enrichTotal.set(0);
    this.message.set('');
    this.enrichNextBatch();
  }

  // Calls the backend batch by batch until nothing is left
  private enrichNextBatch() {
    this.http.post<{ processed: number; remaining: number }>(`${API}/enrich`, {}).subscribe({
      next: res => {
        if (this.enrichTotal() === 0) this.enrichTotal.set(res.processed + res.remaining);
        this.enrichDone.update(done => done + res.processed);

        if (res.remaining > 0 && res.processed > 0) {
          this.enrichNextBatch();
        } else {
          this.enriching.set(false);
          this.message.set('Movie details loaded');
          this.loadFilms();
        }
      },
      error: () => {
        this.enriching.set(false);
        this.message.set('Could not load details from TMDB. Check your token and try again.');
      }
    });
  }

  clearAll() {
    if (!confirm('Delete all films? This cannot be undone.')) return;
    this.http.delete(API).subscribe(() => {
      this.films.set([]);
      this.message.set('All films cleared');
    });
  }
}