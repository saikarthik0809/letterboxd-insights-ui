import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Count { label: string; count: number; }
interface DirectorStat { name: string; count: number; averageRating: number; }
interface HotTake {
  name: string;
  year: number;
  posterPath: string | null;
  yourRating: number;
  tmdbRating: number;
}
interface StatsData {
  totalFilms: number;
  ratedFilms: number;
  averageRating: number;
  totalMinutes: number;
  ratingDistribution: Count[];
  filmsPerYear: Count[];
  decades: Count[];
  topGenres: Count[];
  topDirectors: DirectorStat[];
  ratedHigherThanMost: HotTake[];
  ratedLowerThanMost: HotTake[];
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit {
  private http = inject(HttpClient);

  stats = signal<StatsData | null>(null);
  error = signal(false);

  totalHours = computed(() => Math.round((this.stats()?.totalMinutes ?? 0) / 60));

  ngOnInit() {
    this.http.get<StatsData>('http://localhost:8080/api/stats').subscribe({
      next: data => this.stats.set(data),
      error: () => this.error.set(true)
    });
  }

  // Bar height/width as a percentage of the biggest value in the list
  percent(count: number, list: Count[]) {
    const max = Math.max(1, ...list.map(c => c.count));
    return (count / max) * 100;
  }

  posterUrl(path: string | null) {
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  }
}