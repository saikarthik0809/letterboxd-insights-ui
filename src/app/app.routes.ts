import { Routes } from '@angular/router';
import { Films } from './films/films';
import { Stats } from './stats/stats';

export const routes: Routes = [
  { path: '', component: Films },
  { path: 'stats', component: Stats },
  { path: '**', redirectTo: '' }
];