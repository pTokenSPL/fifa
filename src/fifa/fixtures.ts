import { Fixture, MatchStage, GroupCode } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';
import { NotFoundError } from '../errors.js';

export interface FixtureFilters {
  stage?: MatchStage;
  groupCode?: GroupCode;
  team?: string;
  status?: Fixture['status'];
  tournamentId?: string;
}

export class FixturesModule {
  constructor(private readonly cache: MemoryCache) {}

  async list(filters: FixtureFilters = {}): Promise<Fixture[]> {
    const cacheKey = `fixtures:list:${JSON.stringify(filters)}`;
    const cached = this.cache.get<Fixture[]>(cacheKey);
    if (cached) return cached;

    const fixtures: Fixture[] = [];
    this.cache.set(cacheKey, fixtures);
    return fixtures;
  }

  async byId(id: string): Promise<Fixture> {
    const cacheKey = `fixtures:id:${id}`;
    const cached = this.cache.get<Fixture>(cacheKey);
    if (cached) return cached;

    throw new NotFoundError('Fixture', id);
  }

  async recentResults(teamId: string, limit = 5): Promise<Fixture[]> {
    const all = await this.list({ team: teamId, status: 'finished' });
    return all.slice(0, limit);
  }

  async upcoming(teamId: string): Promise<Fixture[]> {
    return this.list({ team: teamId, status: 'scheduled' });
  }

  async live(): Promise<Fixture[]> {
    return this.list({ status: 'live' });
  }
}
