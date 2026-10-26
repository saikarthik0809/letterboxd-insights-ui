import { TestBed } from '@angular/core/testing';
import { WatchlistApi } from './watchlist-api';

describe('WatchlistApi', () => {
  let service: WatchlistApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
