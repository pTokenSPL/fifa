import { GroupStanding, GroupCode } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';

export class StandingsModule {
  constructor(private readonly cache: MemoryCache) {}

  async group(code: GroupCode): Promise<GroupStanding[]> {
    const cacheKey = `standings:group:${code}`;
    const cached = this.cache.get<GroupStanding[]>(cacheKey);
    if (cached) return cached;

    const standings: GroupStanding[] = [];
    this.cache.set(cacheKey, standings);
    return standings;
  }

  async all(): Promise<Record<GroupCode, GroupStanding[]>> {
    const cacheKey = 'standings:all';
    const cached = this.cache.get<Record<GroupCode, GroupStanding[]>>(cacheKey);
    if (cached) return cached;

    return {} as Record<GroupCode, GroupStanding[]>;
  }

  async forTeam(teamId: string): Promise<GroupStanding | undefined> {
    const all = await this.all();
    for (const standings of Object.values(all)) {
      const found = standings.find(s => s.teamId === teamId);
      if (found) return found;
    }
    return undefined;
  }
}
