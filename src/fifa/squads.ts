import { Player } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';

export class SquadsModule {
  constructor(private readonly cache: MemoryCache) {}

  async byTeam(teamId: string): Promise<Player[]> {
    const cacheKey = `squads:team:${teamId}`;
    const cached = this.cache.get<Player[]>(cacheKey);
    if (cached) return cached;

    const players: Player[] = [];
    this.cache.set(cacheKey, players);
    return players;
  }

  async available(teamId: string): Promise<Player[]> {
    const squad = await this.byTeam(teamId);
    return squad.filter(p => p.available);
  }

  async unavailable(teamId: string): Promise<Player[]> {
    const squad = await this.byTeam(teamId);
    return squad.filter(p => !p.available);
  }
}
