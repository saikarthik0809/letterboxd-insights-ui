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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  films = signal<Film[]>([]);

  ngOnInit() {
    this.http.get<Film[]>('http://localhost:8080/api/films')
      .subscribe(data => this.films.set(data));
  }
}