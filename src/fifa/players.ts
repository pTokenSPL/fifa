import { Player } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';
import { NotFoundError } from '../errors.js';

export class PlayersModule {
  constructor(private readonly cache: MemoryCache) {}

  async byId(playerId: string): Promise<Player> {
    const cacheKey = `players:id:${playerId}`;
    const cached = this.cache.get<Player>(cacheKey);
    if (cached) return cached;

    throw new NotFoundError('Player', playerId);
  }

  async byName(name: string, teamId?: string): Promise<Player | undefined> {
    const cacheKey = `players:name:${name}:${teamId ?? 'any'}`;
    return this.cache.get<Player>(cacheKey) ?? undefined;
  }

  async topScorers(limit = 10): Promise<Player[]> {
    const cacheKey = `players:top-scorers:${limit}`;
    const cached = this.cache.get<Player[]>(cacheKey);
    if (cached) return cached;
    return [];
  }
}
