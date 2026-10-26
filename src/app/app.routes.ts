import { Routes } from '@angular/router';
import { Films } from './films/films';
import { Stats } from './stats/stats';
import { Recommendations } from './recommendations/recommendations';

export const routes: Routes = [
  { path: '', component: Films },
  { path: 'stats', component: Stats },
  { path: 'recommendations', component: Recommendations },
  { path: '**', redirectTo: '' }
];