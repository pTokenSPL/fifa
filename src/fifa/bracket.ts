import { BracketNode, MatchStage } from '../types.js';
import { MemoryCache } from '../cache/memory-cache.js';

export class BracketModule {
  constructor(private readonly cache: MemoryCache) {}

  async current(): Promise<BracketNode[]> {
    const cacheKey = 'bracket:current';
    const cached = this.cache.get<BracketNode[]>(cacheKey);
    if (cached) return cached;
    return [];
  }

  async byRound(round: MatchStage): Promise<BracketNode[]> {
    const all = await this.current();
    return all.filter(n => n.round === round);
  }

  async isEliminated(teamId: string): Promise<boolean> {
    const nodes = await this.current();
    const appeared = nodes.filter(n => n.homeTeamId === teamId || n.awayTeamId === teamId);
    if (appeared.length === 0) return false;
    const lastRound = appeared[appeared.length - 1];
    return lastRound?.winnerId !== undefined && lastRound.winnerId !== teamId;
  }
}
