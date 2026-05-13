export type TournamentId = 'fifa-wc-2026' | 'fifa-wc-2022' | 'fifa-wc-2018' | string;
export type GroupCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
export type MatchStage = 'group' | 'round-of-16' | 'quarterfinal' | 'semifinal' | 'final' | 'third-place';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  countryCode: string;
  groupCode?: GroupCode;
  fifaRanking?: number;
  confederation?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  age?: number;
  caps?: number;
  goals?: number;
  available: boolean;
  injuryNote?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
}

export interface Fixture {
  id: string;
  tournamentId: TournamentId;
  stage: MatchStage;
  groupCode?: GroupCode;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  kickoffUtc: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  homeScore?: number;
  awayScore?: number;
  homePenalties?: number;
  awayPenalties?: number;
  minute?: number;
}

export interface GroupStanding {
  teamId: string;
  groupCode: GroupCode;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface BracketNode {
  round: MatchStage;
  slot: string;
  fixtureId?: string;
  homeTeamId?: string;
  awayTeamId?: string;
  winnerId?: string;
}

export interface MatchEvent {
  id: string;
  fixtureId: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  minute: number;
  teamId: string;
  playerId?: string;
  assistPlayerId?: string;
}

export interface FormRecord {
  teamId: string;
  window: number;
  results: Array<'W' | 'D' | 'L'>;
  goalsScored: number;
  goalsConceded: number;
  formRating: number;
}

export interface WorldCupSDKConfig {
  providers?: {
    footballApi?: { apiKey?: string; baseUrl?: string };
    news?: { enabled?: boolean; apiKey?: string };
  };
  cache?: {
    ttlSeconds?: number;
  };
}
