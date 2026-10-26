import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Film {
  id: number;
  name: string;
  year: number;
  letterboxdUri: string;
  rating: number | null;
  watchedDate: string | null;
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

  ngOnInit() {
    this.loadFilms();
  }

  loadFilms() {
    this.http.get<Film[]>(API).subscribe(data => this.films.set(data));
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

  clearAll() {
    if (!confirm('Delete all films? This cannot be undone.')) return;
    this.http.delete(API).subscribe(() => {
      this.films.set([]);
      this.message.set('All films cleared');
    });
  }
}