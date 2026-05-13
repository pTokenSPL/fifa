import { MatchEvent } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';

export class MatchEventsModule {
  constructor(private readonly cache: MemoryCache) {}

  async byMatch(matchId: string): Promise<MatchEvent[]> {
    const cacheKey = `events:match:${matchId}`;
    const cached = this.cache.get<MatchEvent[]>(cacheKey);
    if (cached) return cached;
    return [];
  }

  async goals(matchId: string): Promise<MatchEvent[]> {
    const events = await this.byMatch(matchId);
    return events.filter(e => e.type === 'goal' || e.type === 'own_goal');
  }

  async redCards(matchId: string): Promise<MatchEvent[]> {
    const events = await this.byMatch(matchId);
    return events.filter(e => e.type === 'red_card');
  }

  async substitutions(matchId: string): Promise<MatchEvent[]> {
    const events = await this.byMatch(matchId);
    return events.filter(e => e.type === 'substitution');
  }
}
