import { Team } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';
import { NotFoundError } from '../errors.js';

export class TeamsModule {
  constructor(private readonly cache: MemoryCache) {}

  async list(): Promise<Team[]> {
    const cacheKey = 'teams:list';
    const cached = this.cache.get<Team[]>(cacheKey);
    if (cached) return cached;

    const teams: Team[] = [];
    this.cache.set(cacheKey, teams);
    return teams;
  }

  async byId(teamId: string): Promise<Team> {
    const cacheKey = `teams:id:${teamId}`;
    const cached = this.cache.get<Team>(cacheKey);
    if (cached) return cached;

    const all = await this.list();
    const team = all.find(t => t.id === teamId);
    if (!team) throw new NotFoundError('Team', teamId);
    this.cache.set(cacheKey, team);
    return team;
  }

  async byName(name: string): Promise<Team | undefined> {
    const all = await this.list();
    const lower = name.toLowerCase();
    return all.find(
      t => t.name.toLowerCase().includes(lower) || t.shortName.toLowerCase().includes(lower),
    );
  }
}
