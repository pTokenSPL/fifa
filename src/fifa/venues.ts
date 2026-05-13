import { Venue } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';
import { NotFoundError } from '../errors.js';

export class VenuesModule {
  constructor(private readonly cache: MemoryCache) {}

  async list(): Promise<Venue[]> {
    const cacheKey = 'venues:list';
    const cached = this.cache.get<Venue[]>(cacheKey);
    if (cached) return cached;
    return [];
  }

  async byId(venueId: string): Promise<Venue> {
    const cacheKey = `venues:id:${venueId}`;
    const cached = this.cache.get<Venue>(cacheKey);
    if (cached) return cached;

    throw new NotFoundError('Venue', venueId);
  }
}
