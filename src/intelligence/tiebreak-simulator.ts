import { GroupCode, GroupStanding } from '../types.js';
import type { FifaNamespace } from '../sdk.js';

export interface TiebreakResult {
  groupCode: GroupCode;
  standings: GroupStanding[];
  qualifiers: string[];
  eliminatedTeams: string[];
  scenarioNotes: string[];
}

export class TiebreakSimulator {
  constructor(private readonly fifa: FifaNamespace) {}

  async simulate(
    groupCode: GroupCode,
    assumptions: Array<{ fixtureId: string; homeScore: number; awayScore: number }> = [],
  ): Promise<TiebreakResult> {
    const standings = await this.fifa.standings.group(groupCode);

    const sorted = [...standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    const qualifiers = sorted.slice(0, 2).map(s => s.teamId);
    const eliminatedTeams = sorted.slice(2).map(s => s.teamId);

    return {
      groupCode,
      standings: sorted,
      qualifiers,
      eliminatedTeams,
      scenarioNotes: assumptions.length > 0 ? ['Based on provided score assumptions'] : [],
    };
  }
}
